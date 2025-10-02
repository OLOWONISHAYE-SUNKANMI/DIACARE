'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ManageAccessModalProps {
  open: boolean;
  onClose: () => void;
  memberName: string;
}

export default function ManageAccessModal({ open, onClose, memberName }: ManageAccessModalProps) {
  const [access, setAccess] = useState('read');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Access for {memberName}</DialogTitle>
        </DialogHeader>
        <RadioGroup value={access} onValueChange={setAccess} className="space-y-3">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="read" id="read" />
            <Label htmlFor="read">Read Only</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="full" id="full" />
            <Label htmlFor="full">Full Access</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="remove" id="remove" />
            <Label htmlFor="remove">Remove Access</Label>
          </div>
        </RadioGroup>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button className="bg-medical-teal hover:bg-medical-teal/90" onClick={onClose}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
