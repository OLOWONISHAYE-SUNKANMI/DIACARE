import React, { useEffect, useState } from 'react';
import {
  Activity,
  Brain,
  FileText,
  Bell,
  AlertTriangle,
  Database,
  Plus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useGlucose } from '@/contexts/GlucoseContext';
import { useHbA1c } from '@/contexts/HemoglobinTracker';
import { useBloodPressure } from '@/contexts/BloodPressure';
import { useWeightIbm } from '@/contexts/WeightIbmContext';
import { useCholesterolProfile } from '@/contexts/CholeterolProfileContext';
import { useKidneyFunction } from '@/contexts/KidneyFunctionContext';
import { useScreeningExam } from '@/contexts/ScreeningExamsContext';

// ✅ Placeholder component for InsulinDoseSheet (replace with your actual one)
const InsulinDoseSheet = () => (
  <div className="p-6 bg-gray-100 rounded-lg text-center">
    <p className="text-gray-600">Insulin Dose Sheet goes here</p>
  </div>
);

const Biomarkers = () => {
  const { t } = useTranslation();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getLatestReading } = useGlucose();

  // ✅ Example biomarker state
  const [biomarkers, setBiomarkers] = useState({
    hba1c: '',
    hba1cDate: new Date(),
    systolicBP: '',
    diastolicBP: '',
    bpDate: new Date(),
    weight: '',
    height: '',
    weightDate: new Date(),
    bmi: '',
    totalCholesterol: '',
    hdlCholesterol: '',
    ldlCholesterol: '',
    triglycerides: '',
    cholesterolDate: new Date(),
    creatinine: '',
    creatinineDate: new Date(),
    microalbumin: '',
    lastEyeExam: new Date(),
    lastFootExam: new Date(),
  });

  const handleBiomarkerChange = (field, value) => {
    setBiomarkers(prev => {
      const updated = { ...prev, [field]: value };

      // auto-calc BMI
      if (field === 'weight' || field === 'height') {
        const w = parseFloat(updated.weight);
        const h = parseFloat(updated.height) / 100;
        updated.bmi = w && h ? (w / (h * h)).toFixed(1) : '';
      }

      return updated;
    });
  };

  const getBMICategory = bmi => {
    if (!bmi)
      return {
        category: t('biomarkerTracker.bmi.notSet'),
        color: 'text-gray-400',
      };
    const val = parseFloat(bmi);
    if (val < 18.5)
      return {
        category: t('biomarkerTracker.bmi.underweight'),
        color: 'text-blue-600',
      };
    if (val < 25)
      return {
        category: t('biomarkerTracker.bmi.normal'),
        color: 'text-green-600',
      };
    if (val < 30)
      return {
        category: t('biomarkerTracker.bmi.overweight'),
        color: 'text-orange-600',
      };
    return { category: t('biomarkerTracker.bmi.obese'), color: 'text-red-600' };
  };

  const doctorNotes = {
    recommendations: t('biomarkerTracker.doctorNotes.recommendations'),
    specialInstructions: t('biomarkerTracker.doctorNotes.specialInstructions'),
    followUpDate: '2025-10-01', // Dates usually stay as-is, but you can format with locale
  };

  // ✅ Example glucose data
  const glucoseData = [{ time: '08:00', glucose: getLatestReading().value }];

  const alertSettings = { lowThreshold: 70, highThreshold: 180 };
  const alerts = [
    { id: 1, type: 'hypo', message: t('biomarkerTracker.alerts.hypo') },
    { id: 2, type: 'hyper', message: t('biomarkerTracker.alerts.hyper') },
  ];

  const showBiomarkers = true;

  useEffect(() => {
    fetchPrediction();
  }, []);

  const fetchPrediction = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          glucoseHistory: glucoseData.map(d => d.glucose).join(','),
        }),
      });

      const data = await res.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  // HbA1cCard implementation
  const { readings, addReading, getLatestHba1cReading, loadingHba1c } =
    useHbA1c();

  const latest = getLatestHba1cReading();

  // Blood pressure card implementation
  const { addBloodReading, getLatestBloodReading, loadingBlood } =
    useBloodPressure();

  const latestData = getLatestBloodReading();

  // Weight & BMI card implementation
  const { addWeightIbmReading, getLatestWeightIbmReading, loadingWeightIbm } =
    useWeightIbm();
  const latestWeight = getLatestWeightIbmReading();

  // Cholesterol card implementation
  const {
    addCholesterolReading,
    getLatestCholesterolReading,
    loadingCholesterol,
  } = useCholesterolProfile();
  const latestCholesterol = getLatestCholesterolReading();

  // Kidney Function card implementation
  const {
    addKidneyFunctionReading,
    getLatestKidneyFunctionReading,
    loadingKidneyFunction,
  } = useKidneyFunction();
  const latestKidneyFunction = getLatestKidneyFunctionReading();

  // Screening Exams card implementation
  const {
    addScreeningExamReading,
    getLatestScreeningExamReading,
    loadingScreeningExam,
  } = useScreeningExam();
  const latestScreeningExam = getLatestScreeningExamReading();
  return (
    <div className="p-6 bg-muted">
      {showBiomarkers ? (
        <div className="space-y-6">
          {/* Biomarkers Tracking */}
          <div className="bg-background rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Activity className="text-purple-500 mr-2" size={24} />
              <h2 className="text-xl font-semibold text-foreground">
                {t('biomarkerTracker.title')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* HbA1c */}
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-red-800 mb-3">
                    {t('biomarkerTracker.hba1cTitle')}
                  </h3>

                  <button
                    type="submit"
                    onClick={() =>
                      addReading({
                        percentage: biomarkers.hba1c,
                        recorded_data: biomarkers.hba1cDate, // Changed to Date
                      })
                    }
                    className="flex items-center gap-1 text-sm bg-red-300 text-red-500 rounded-sm px-3 py-1"
                  >
                    <Plus className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-red-500">
                      {loadingHba1c ? 'Saving...' : 'Save'}
                    </span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={biomarkers.hba1c}
                      onChange={e =>
                        handleBiomarkerChange('hba1c', e.target.value)
                      }
                      placeholder={t('biomarkerTracker.hba1cPlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      {t('biomarkerTracker.hba1cUnit')}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={biomarkers.hba1cDate}
                    onChange={e =>
                      handleBiomarkerChange('hba1cDate', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  {biomarkers.hba1c && (
                    <p
                      className={`text-xs ${
                        parseFloat(biomarkers.hba1c) < 7
                          ? 'text-green-600'
                          : parseFloat(biomarkers.hba1c) < 8
                          ? 'text-orange-600'
                          : 'text-red-600'
                      }`}
                    >
                      {t('biomarkerTracker.hba1cTarget')}
                    </p>
                  )}
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-blue-800 mb-3">
                    {t('biomarkerTracker.bloodPressureTitle')}
                  </h3>
                  <button
                    type="submit"
                    onClick={() =>
                      addBloodReading({
                        systolic: biomarkers.systolicBP,
                        diastolic: biomarkers.diastolicBP,
                        recorded_date: biomarkers.bpDate,
                      })
                    }
                    className="flex items-center gap-1 text-sm bg-blue-300 text-blue-500 rounded-sm px-3 py-1"
                  >
                    <Plus className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-blue-500">
                      {loadingBlood ? 'Saving..' : 'Save'}
                    </span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={biomarkers.systolicBP}
                      onChange={e =>
                        handleBiomarkerChange('systolicBP', e.target.value)
                      }
                      placeholder={t(
                        'biomarkerTracker.bloodPressureSystolicPlaceholder'
                      )}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm">/</span>
                    <input
                      type="number"
                      value={biomarkers.diastolicBP}
                      onChange={e =>
                        handleBiomarkerChange('diastolicBP', e.target.value)
                      }
                      placeholder={t(
                        'biomarkerTracker.bloodPressureDiastolicPlaceholder'
                      )}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      {t('biomarkerTracker.bloodPressureUnit')}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={biomarkers.bpDate}
                    onChange={e =>
                      handleBiomarkerChange('bpDate', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  {biomarkers.systolicBP && biomarkers.diastolicBP && (
                    <p
                      className={`text-xs ${
                        parseFloat(biomarkers.systolicBP) < 130 &&
                        parseFloat(biomarkers.diastolicBP) < 80
                          ? 'text-green-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {t('biomarkerTracker.bloodPressureTarget')}
                    </p>
                  )}
                </div>
              </div>

              {/* Weight & BMI */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-green-800 mb-3">
                    {t('biomarkerTracker.weightBmiTitle')}
                  </h3>
                  <button
                    type="submit"
                    onClick={() =>
                      addWeightIbmReading({
                        weight_kg: biomarkers.weight,
                        height_cm: biomarkers.height,
                        recorded_date: biomarkers.weightDate,
                      })
                    }
                    className="flex items-center gap-1 text-sm bg-green-300 text-green-500 rounded-sm px-3 py-1"
                  >
                    <Plus className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-green-500">Save</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={biomarkers.weight}
                      onChange={e =>
                        handleBiomarkerChange('weight', e.target.value)
                      }
                      placeholder={t('biomarkerTracker.weightPlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      {t('biomarkerTracker.weightUnit')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={biomarkers.height}
                      onChange={e =>
                        handleBiomarkerChange('height', e.target.value)
                      }
                      placeholder={t('biomarkerTracker.heightPlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      {t('biomarkerTracker.heightUnit')}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={biomarkers.weightDate}
                    onChange={e =>
                      handleBiomarkerChange('weightDate', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  {biomarkers.bmi && (
                    <div className="text-xs">
                      <span className="font-medium">
                        {t('biomarkerTracker.bmiLabel')}: {biomarkers.bmi}
                      </span>
                      <span
                        className={`ml-2 ${
                          getBMICategory(biomarkers.bmi).color
                        }`}
                      >
                        ({getBMICategory(biomarkers.bmi).category})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Cholesterol */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-yellow-800 mb-3">
                    {t('biomarkerTracker.cholesterolProfileTitle')}
                  </h3>
                  <button
                    type="submit"
                    onClick={() =>
                      addCholesterolReading({
                        total_cholesterol: biomarkers.totalCholesterol,
                        hdl: biomarkers.hdlCholesterol,
                        ldl: biomarkers.ldlCholesterol,
                        triglycerides: biomarkers.triglycerides,
                        recorded_date: biomarkers.cholesterolDate,
                      })
                    }
                    className="flex items-center gap-1 text-sm bg-yellow-300 text-yellow-500 rounded-sm px-3 py-1"
                  >
                    <Plus className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm text-yellow-500">Save</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1">
                    <input
                      type="number"
                      value={biomarkers.totalCholesterol}
                      onChange={e =>
                        handleBiomarkerChange(
                          'totalCholesterol',
                          e.target.value
                        )
                      }
                      placeholder={t(
                        'biomarkerTracker.cholesterolPlaceholderTotal'
                      )}
                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                    <input
                      type="number"
                      value={biomarkers.hdlCholesterol}
                      onChange={e =>
                        handleBiomarkerChange('hdlCholesterol', e.target.value)
                      }
                      placeholder={t(
                        'biomarkerTracker.cholesterolPlaceholderHDL'
                      )}
                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                    <input
                      type="number"
                      value={biomarkers.ldlCholesterol}
                      onChange={e =>
                        handleBiomarkerChange('ldlCholesterol', e.target.value)
                      }
                      placeholder={t(
                        'biomarkerTracker.cholesterolPlaceholderLDL'
                      )}
                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={biomarkers.triglycerides}
                      onChange={e =>
                        handleBiomarkerChange('triglycerides', e.target.value)
                      }
                      placeholder={t(
                        'biomarkerTracker.cholesterolPlaceholderTriglycerides'
                      )}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      {t('biomarkerTracker.cholesterolUnit')}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={biomarkers.cholesterolDate}
                    onChange={e =>
                      handleBiomarkerChange('cholesterolDate', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <p className="text-xs text-gray-600">
                    {t('biomarkerTracker.cholesterolTargets')}
                  </p>
                </div>
              </div>

              {/* Kidney Function */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-purple-800 mb-3">
                    {t('biomarkerTracker.kidneyFunctionTitle')}
                  </h3>
                  <button
                    type="submit"
                    onClick={() =>
                      addKidneyFunctionReading({
                        creatinine: biomarkers.creatinine,
                        microalbumin: biomarkers.microalbumin,
                        recorded_date: biomarkers.creatinineDate,
                      })
                    }
                    className="flex items-center gap-1 text-sm bg-purple-300 text-purple-500 rounded-sm px-3 py-1"
                  >
                    <Plus className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-purple-500">Save</span>
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={biomarkers.creatinine}
                      onChange={e =>
                        handleBiomarkerChange('creatinine', e.target.value)
                      }
                      placeholder={t('biomarkerTracker.creatininePlaceholder')}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      {t('biomarkerTracker.creatinineUnit')}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={biomarkers.microalbumin}
                      onChange={e =>
                        handleBiomarkerChange(
                          'biomarkerTracker.microalbumin',
                          e.target.value
                        )
                      }
                      placeholder={t(
                        'biomarkerTracker.microalbuminPlaceholder'
                      )}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      {t('biomarkerTracker.microalbuminUnit')}
                    </span>
                  </div>
                  <input
                    type="date"
                    value={
                      biomarkers.creatinineDate?.toISOString().split('T')[0]
                    }
                    onChange={e =>
                      handleBiomarkerChange('creatinineDate', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              {/* Screening Exams */}
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-indigo-800 mb-3">
                    {t('biomarkerTracker.screeningExamsTitle')}
                  </h3>
                  <button
                    type="submit"
                    onClick={() =>
                      addScreeningExamReading({
                        last_eye_exam: biomarkers.lastEyeExam,
                        last_foot_exam: biomarkers.lastFootExam,
                      })
                    }
                    className="flex items-center gap-1 text-sm bg-indigo-300 text-indigo-500 rounded-sm px-3 py-1"
                  >
                    <Plus className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm text-indigo-500">Save</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('biomarkerTracker.lastEyeExamLabel')}
                    </label>
                    <input
                      type="date"
                      value={biomarkers.lastEyeExam}
                      onChange={e =>
                        handleBiomarkerChange('lastEyeExam', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('biomarkerTracker.lastFootExamLabel')}
                    </label>
                    <input
                      type="date"
                      value={biomarkers.lastFootExam}
                      onChange={e =>
                        handleBiomarkerChange('lastFootExam', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {t('biomarkerTracker.screeningExamsNote')}
                  </p>
                </div>
              </div>
            </div>

            {/* Biomarkers Summary */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-foreground mb-3">
                {t('biomarkerTracker.quickSummaryTitle')}
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {/* HbA1c */}
                <div className="text-center">
                  <div className="font-medium text-foreground">
                    {t('biomarkerTracker.hba1cLabel')}
                  </div>
                  <div
                    className={`font-bold ${
                      biomarkers.hba1c
                        ? parseFloat(biomarkers.hba1c) < 7
                          ? 'text-green-600'
                          : parseFloat(biomarkers.hba1c) < 8
                          ? 'text-orange-600'
                          : 'text-red-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {biomarkers.hba1c
                      ? `${biomarkers.hba1c}%`
                      : t('biomarkerTracker.notSet')}
                  </div>
                </div>

                {/* BP */}
                <div className="text-center">
                  <div className="font-medium text-foreground">
                    {t('biomarkerTracker.bpLabel')}
                  </div>
                  <div
                    className={`font-bold ${
                      biomarkers.systolicBP && biomarkers.diastolicBP
                        ? parseFloat(biomarkers.systolicBP) < 130 &&
                          parseFloat(biomarkers.diastolicBP) < 80
                          ? 'text-green-600'
                          : 'text-orange-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {biomarkers.systolicBP && biomarkers.diastolicBP
                      ? `${biomarkers.systolicBP}/${biomarkers.diastolicBP}`
                      : t('biomarkerTracker.notSet')}
                  </div>
                </div>

                {/* BMI */}
                <div className="text-center">
                  <div className="font-medium text-foreground">
                    {t('biomarkerTracker.bmiLabel')}
                  </div>
                  <div
                    className={`font-bold ${
                      biomarkers.bmi
                        ? getBMICategory(biomarkers.bmi).color
                        : 'text-gray-400'
                    }`}
                  >
                    {biomarkers.bmi || t('notSet')}
                  </div>
                </div>

                {/* LDL */}
                <div className="text-center">
                  <div className="font-medium text-foreground">
                    {t('biomarkerTracker.ldlLabel')}
                  </div>
                  <div
                    className={`font-bold ${
                      biomarkers.ldlCholesterol
                        ? parseFloat(biomarkers.ldlCholesterol) < 100
                          ? 'text-green-600'
                          : 'text-orange-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {biomarkers.ldlCholesterol
                      ? `${biomarkers.ldlCholesterol} mg/dL`
                      : t('biomarkerTracker.notSet')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Prediction */}
          <div className="bg-background rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Brain className="text-purple-500 mr-2" size={24} />
              <h2 className="text-xl text-foreground font-semibold">
                {t('biomarkerTracker.aiPredictionEngineTitle')}
              </h2>
            </div>

            {loading ? (
              <p className="text-gray-500">Laoding prediction...</p>
            ) : (
              prediction && (
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('biomarkerTracker.nextPredictionLabel')}
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {t('biomarkerTracker.predictionUnit', {
                      value: prediction,
                    })}
                  </p>
                  <p className="text-xs text-foreground mt-1">
                    {t('biomarkerTracker.predictionNote')}
                  </p>
                </div>
              )
            )}
          </div>

          {/* Doctor's Recommendations Display */}
          {(doctorNotes.recommendations || doctorNotes.specialInstructions) && (
            <div className="bg-background rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="text-blue-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-foreground">
                  {t('biomarkerTracker.doctorsRecommendations')}
                </h2>
              </div>

              <div className="space-y-4">
                {doctorNotes.recommendations && (
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h3 className="font-medium text-blue-800 mb-2">
                      {t('biomarkerTracker.treatmentRecommendations')}
                    </h3>
                    <p className="text-sm text-blue-700">
                      {doctorNotes.recommendations}
                    </p>
                  </div>
                )}

                {doctorNotes.specialInstructions && (
                  <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                    <h3 className="font-medium text-amber-800 mb-2">
                      {t('biomarkerTracker.specialInstructions')}
                    </h3>
                    <p className="text-sm text-amber-700">
                      {doctorNotes.specialInstructions}
                    </p>
                  </div>
                )}

                {doctorNotes.followUpDate && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center text-green-800">
                      <span className="font-medium text-sm">
                        {t('biomarkerTracker.nextAppointment')}{' '}
                      </span>
                      <span className="ml-2 text-sm">
                        {new Date(doctorNotes.followUpDate).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* </div> */}

          {/* Main Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Real-Time Graph */}
            <div className="bg-background rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Activity className="text-green-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-foreground">
                  {t('biomarkerTracker.realTimeBloodGlucose')}
                </h2>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={glucoseData}>
                    {/* Grid */}
                    <CartesianGrid
                      stroke="hsl(var(--border))"
                      strokeDasharray="3 3"
                    />

                    {/* Axes */}
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      domain={[50, 250]}
                      stroke="hsl(var(--muted-foreground))"
                    />

                    {/* Tooltip & Legend */}
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Legend
                      wrapperStyle={{ color: 'hsl(var(--foreground))' }}
                    />

                    {/* Reference lines */}
                    <ReferenceLine
                      y={alertSettings.lowThreshold}
                      stroke="hsl(var(--warning))"
                      strokeDasharray="5 5"
                      label={{
                        value: 'Low',
                        fill: 'hsl(var(--warning))',
                        position: 'right',
                      }}
                    />
                    <ReferenceLine
                      y={alertSettings.highThreshold}
                      stroke="hsl(var(--destructive))"
                      strokeDasharray="5 5"
                      label={{
                        value: 'High',
                        fill: 'hsl(var(--destructive))',
                        position: 'right',
                      }}
                    />

                    {/* Main line */}
                    <Line
                      type="monotone"
                      dataKey="glucose"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={props => {
                        const { payload, cx, cy } = props;
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill={
                              payload.predicted
                                ? 'hsl(var(--foreground))'
                                : 'hsl(var(--primary))'
                            }
                            stroke={
                              payload.predicted
                                ? 'hsl(var(--accent))'
                                : 'hsl(var(--primary))'
                            }
                            strokeWidth={2}
                          />
                        );
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <span className="flex items-center text-foreground">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  {t('biomarkerTracker.glucoseLegend.actualReadings')}
                </span>

                <span className="flex items-center text-foreground">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  {t('biomarkerTracker.glucoseLegend.aiPredictions')}
                </span>
              </div>
            </div>

            {/* Alerts System */}
            <div className="bg-background rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Bell className="text-red-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-foreground">
                  {t('biomarkerTracker.alertsSystem.title')}
                </h2>
              </div>

              {alerts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  {t('biomarkerTracker.alertsSystem.noAlerts')}
                </p>
              ) : (
                <div className="space-y-3">
                  {alerts.map(alert => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border-l-4 ${
                        alert.type === 'hypo'
                          ? 'bg-red-50 border-red-500'
                          : 'bg-orange-50 border-orange-500'
                      }`}
                    >
                      <div className="flex items-center">
                        <AlertTriangle
                          className={
                            alert.type === 'hypo'
                              ? 'text-red-500'
                              : 'text-orange-500'
                          }
                          size={20}
                        />
                        <span className="ml-2 font-medium text-gray-800">
                          {alert.type === 'hypo'
                            ? t('biomarkerTracker.alertsSystem.hypoAlert')
                            : t('biomarkerTracker.alertsSystem.hyperAlert')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('biomarkerTracker.alertsSystem.alertMessage', {
                          message: alert.message,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Database Status */}
            <div className="bg-background rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Database className="text-gray-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-foreground">
                  {t('biomarkerTracker.historicalDatabase.title')}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-muted-foreground">
                    {t('biomarkerTracker.historicalDatabase.totalReadings')}
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {glucoseData.length}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-muted-foreground">
                    {t('biomarkerTracker.historicalDatabase.dataPointsToday')}
                  </p>
                  <p className="text-xl font-bold text-foreground">
                    {glucoseData.filter(d => !d.predicted).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <InsulinDoseSheet />
      )}
    </div>
  );
};

export default Biomarkers;
