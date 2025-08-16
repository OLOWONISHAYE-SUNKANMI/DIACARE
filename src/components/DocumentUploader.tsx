import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DocumentUploaderProps {
  documents: File[];
  setDocuments: (files: File[]) => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  documents,
  setDocuments,
  maxFiles = 5,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return `${file.name}: Fichier trop volumineux (max 10MB)`;
    }

    // Check file type
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      return `${file.name}: Type de fichier non supporté`;
    }

    return null;
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;

    const newFiles = Array.from(fileList);
    const newErrors: string[] = [];

    // Check total number of files
    if (documents.length + newFiles.length > maxFiles) {
      newErrors.push(`Maximum ${maxFiles} fichiers autorisés`);
      setErrors(newErrors);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        newErrors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    // Check for duplicates
    const existingNames = documents.map(doc => doc.name);
    const filteredFiles = validFiles.filter(file => {
      if (existingNames.includes(file.name)) {
        newErrors.push(`${file.name}: Fichier déjà ajouté`);
        return false;
      }
      return true;
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors([]), 5000);
    }

    if (filteredFiles.length > 0) {
      setDocuments([...documents, ...filteredFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const removeFile = (index: number) => {
    const newFiles = documents.filter((_, i) => i !== index);
    setDocuments(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-6 w-6 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">
          📎 Documents justificatifs
        </h3>
        <span className="text-sm text-gray-500">
          {documents.length}/{maxFiles} fichiers
        </span>
      </div>

      {/* Upload Zone */}
      <Card
        className={`
          relative border-2 border-dashed p-8 text-center transition-all duration-200 cursor-pointer
          ${dragActive 
            ? 'border-emerald-400 bg-emerald-50' 
            : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            Glissez vos documents ici
          </p>
          <p className="text-sm text-gray-500">
            ou <span className="text-emerald-600 font-medium">cliquez pour sélectionner</span>
          </p>
          <p className="text-xs text-gray-400">
            {acceptedTypes.join(', ')} - Max {maxFiles} fichiers - 10MB par fichier
          </p>
        </div>
      </Card>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {documents.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Documents ajoutés :</h4>
          {documents.map((file, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Required Documents Info */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <h4 className="font-medium text-blue-900 mb-2">
          📋 Documents requis :
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Diplôme de médecine ou certification professionnelle</li>
          <li>• Licence d'exercice en cours de validité</li>
          <li>• Certificat d'inscription à l'ordre des médecins</li>
          <li>• CV professionnel détaillé</li>
          <li>• Pièce d'identité (optionnel mais recommandé)</li>
        </ul>
      </Card>
    </div>
  );
};