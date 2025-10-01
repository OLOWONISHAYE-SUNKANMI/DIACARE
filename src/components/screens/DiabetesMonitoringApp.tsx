import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import {
  AlertTriangle,
  Activity,
  Droplets,
  Utensils,
  Syringe,
  Settings,
  Database,
  Brain,
  Bell,
  FileText,
  Share2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useGlucose } from '@/contexts/GlucoseContext';





const DiabetesMonitoringApp = () => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [currentGlucose, setCurrentGlucose] = useState(120);
  const [insulin, setInsulin] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const { t } = useTranslation();
  const [activity, setActivity] = useState(0);
  const [alertSettings, setAlertSettings] = useState({
    lowThreshold: 70,
    highThreshold: 180,
  });
  const { readings: glucose } = useGlucose();
  const disabled = true


  const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
      // Glucose data
 

  const [alerts, setAlerts] = useState([]);
  const [prediction, setPrediction] = useState(null);

  // Insulin dose sheet states
  const [glucoseUnit, setGlucoseUnit] = useState('mg/dL');
  const [insulinDoses, setInsulinDoses] = useState({
    breakfast: {
      range1: '',
      range2: '',
      range3: '',
      range4: '',
      range5: '',
      snack: '',
    },
    lunch: {
      range1: '',
      range2: '',
      range3: '',
      range4: '',
      range5: '',
      snack: '',
    },
    supper: {
      range1: '',
      range2: '',
      range3: '',
      range4: '',
      range5: '',
      snack: '',
    },
    bedtime: '',
  });
  const [penColors, setPenColors] = useState({
    breakfast: '',
    breakfast_color: '',
    lunch: '',
    lunch_color: '',
    supper: '',
    supper_color: '',
    bedtime: '',
    bedtime_color: '',
  });
  const [doctorInfo, setDoctorInfo] = useState({
    name: '',
    signature: '',
    date: '',
  });
  const [doctorNotes, setDoctorNotes] = useState({
    generalNotes: '',
    observations: '',
    recommendations: '',
    specialInstructions: '',
    followUpDate: '',
    emergencyContact: '',
  });
  const [specialNotes, setSpecialNotes] = useState({
    breakfast: {
      range1: t('insulinDosage.mealGuidance.breakfast.range1'),
      range2: '',
      range3: '',
      range4: '',
      range5: t('insulinDosage.mealGuidance.breakfast.range5'),
    },
    lunch: {
      range1: t('insulinDosage.mealGuidance.lunch.range1'),
      range2: '',
      range3: '',
      range4: '',
      range5: t('insulinDosage.mealGuidance.lunch.range5'),
    },
    supper: {
      range1: t('insulinDosage.mealGuidance.supper.range1'),
      range2: '',
      range3: '',
      range4: '',
      range5: t('insulinDosage.mealGuidance.supper.range5'),
    },
  });
  const [patientName, setPatientName] = useState('');





  // Check for alerts



  // Glucose unit conversion functions
  const getGlucoseRanges = (unit, t) => {
    if (unit === 'mg/dL') {
      return {
        range1: t('insulinDosage.glucoseRanges.mgdl.range1'), // 70 or less
        range2: t('insulinDosage.glucoseRanges.mgdl.range2'), // 72 - 144
        range3: t('insulinDosage.glucoseRanges.mgdl.range3'), // 145 - 216
        range4: t('insulinDosage.glucoseRanges.mgdl.range4'), // 217 - 306
        range5: t('insulinDosage.glucoseRanges.mgdl.range5'), // 307 or more
        snackBreakfast: t('insulinDosage.glucoseRanges.mgdl.snackBreakfast'), // 72 or more
        snackLunch: t('insulinDosage.glucoseRanges.mgdl.snackLunch'), // 72 or more
        snackSupper: t('insulinDosage.glucoseRanges.mgdl.snackSupper'), // 108 or more
      };
    } else {
      return {
        range1: t('insulinDosage.glucoseRanges.mmol.range1'), // 3.9 or less
        range2: t('insulinDosage.glucoseRanges.mmol.range2'), // 4.0 - 8.0
        range3: t('insulinDosage.glucoseRanges.mmol.range3'), // 8.1 - 12.0
        range4: t('insulinDosage.glucoseRanges.mmol.range4'), // 12.1 - 17.0
        range5: t('insulinDosage.glucoseRanges.mmol.range5'), // 17.1 or more
        snackBreakfast: t('insulinDosage.glucoseRanges.mmol.snackBreakfast'), // 4.0 or more
        snackLunch: t('insulinDosage.glucoseRanges.mmol.snackLunch'), // 4.0 or more
        snackSupper: t('insulinDosage.glucoseRanges.mmol.snackSupper'), // 6.0 or more
      };
    }
  };

  const handleInsulinDoseChange = (meal, range, value) => {
    setInsulinDoses(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [range]: value,
      },
    }));
  };

  const handlePenColorChange = (meal, value) => {
    setPenColors(prev => ({
      ...prev,
      [meal]: value,
    }));
  };

  const handleSpecialNoteChange = (meal, range, value) => {
    setSpecialNotes(prev => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [range]: value,
      },
    }));
  };

  const shareWithDoctor = () => {
    const ranges = getGlucoseRanges(glucoseUnit, t);
    const patientDisplayName =
      patientName || t('insulinDosage.share.patientFallback');

    const shareText = `
🏥 ${t('insulinDosage.share.title')}
${t('insulinDosage.share.patient')}: ${patientDisplayName}
${t('insulinDosage.share.date')}: ${new Date().toLocaleDateString()}
${t('insulinDosage.share.units')}: ${glucoseUnit}

=== ${t('insulinDosage.share.breakfast')} ===
${ranges.range1}: ${insulinDoses.breakfast?.range1 || t('share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range2}: ${insulinDoses.breakfast?.range2 || t('share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range3}: ${insulinDoses.breakfast?.range3 || t('share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range4}: ${insulinDoses.breakfast?.range4 || t('share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range5}: ${insulinDoses.breakfast?.range5 || t('share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${t('share.snack')}: ${insulinDoses.breakfast?.snack || t('share.notSet')} ${t('insulinDosage.share.unitsLabel')}

=== ${t('share.lunch')} ===
${ranges.range1}: ${insulinDoses.lunch?.range1 || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range2}: ${insulinDoses.lunch?.range2 || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range3}: ${insulinDoses.lunch?.range3 || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range4}: ${insulinDoses.lunch?.range4 || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range5}: ${insulinDoses.lunch?.range5 || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${t('insulinDosage.share.snack')}: ${insulinDoses.lunch?.snack || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}

=== ${t('share.supper')} ===
${ranges.range1}: ${insulinDoses.supper?.range1 || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range2}: ${insulinDoses.supper?.range2 || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range3}: ${insulinDoses.supper?.range3 || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range4}: ${insulinDoses.supper?.range4 || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${ranges.range5}: ${insulinDoses.supper?.range5 || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}
${t('insulinDosage.share.snack')}: ${insulinDoses.supper?.snack || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}

=== ${t('insulinDosage.share.bedtime')} ===
${t('insulinDosage.share.basalInsulin')}: ${insulinDoses.bedtime || t('insulinDosage.share.notSet')} ${t('insulinDosage.share.unitsLabel')}

🩺 ${t('insulinDosage.share.healthcareProvider')}
${t('insulinDosage.share.doctor')}: ${doctorInfo.name || t('insulinDosage.share.notSpecified')}
${t('insulinDosage.share.date')}: ${doctorInfo.date || t('insulinDosage.share.notSpecified')}

📝 ${t('insulinDosage.share.doctorNotes')}
${
  doctorNotes.recommendations
    ? `${t('insulinDosage.share.recommendations')}: ${doctorNotes.recommendations}\n`
    : ''
}${
      doctorNotes.specialInstructions
        ? `${t('insulinDosage.share.specialInstructions')}: ${doctorNotes.specialInstructions}\n`
        : ''
    }${
      doctorNotes.followUpDate
        ? `${t('insulinDosage.share.nextAppointment')}: ${new Date(
            doctorNotes.followUpDate
          ).toLocaleDateString()}`
        : ''
    }

${t('insulinDosage.share.generatedFrom')}
`.trim();

    if (navigator.share) {
      navigator.share({
        title: `${t('insulinDosage.share.title')} - ${patientDisplayName}`,
        text: shareText,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert(t('share.copySuccess'));
      });
    } else {
      const blob = new Blob([shareText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `insulin-dose-sheet-${patientDisplayName.replace(/\s+/g, '-')}.txt`;
      link.click();
    }
  };

  // Insulin Dose Sheet Component
  const InsulinDoseSheet = () => {
    const ranges = getGlucoseRanges(glucoseUnit, t);

    const MealSection = ({
      mealName,
      mealKey,
      ranges,
      insulinDoses,
      penColors,
    }) => (
      <div className="mb-6">
        <div className="bg-background text-foreground px-3 py-1 inline-block font-bold mb-2">
          {mealName}
        </div>

        <div className="text-sm mb-2 flex items-center gap-2">
          {t('insulinDosage.slidingScale.insulinText')} (
          <input
          disabled={disabled}

            type="text"
            value={penColors[mealKey] || ''}
            onChange={e => handlePenColorChange(mealKey, e.target.value)}
            className="border border-border bg-background focus:ring focus:ring-accent focus:border-0 px-1 py-0.5 w-20 text-center"
            placeholder={t('insulinDosage.slidingScale.typePlaceholder')}
          />
          ) {t('insulinDosage.slidingScale.penColour')}
          <input
          disabled={disabled}

            type="text"
            value={penColors[mealKey + '_color'] || ''}
            onChange={e =>
              handlePenColorChange(mealKey + '_color', e.target.value)
            }
            className="border  border-border bg-background focus:ring focus:ring-accent focus:border-0 px-1 py-0.5 w-20 text-center"
            placeholder={t(
              'insulinDosage.insulinDosage.slidingScale.colorPlaceholder'
            )}
          />
        </div>

        <table className="w-full border-collapse border border-[hsl(var(--border))] mb-2">
          <thead>
            <tr className="bg-[hsl(var(--muted))]">
              <th className="border border-[hsl(var(--border))] px-3 py-2 text-left font-bold">
                {t('insulinDosage.insulinTable.bloodSugar')} ({glucoseUnit})
              </th>
              <th className="border border-[hsl(var(--border))] px-3 py-2 text-left font-bold">
                {t('insulinDosage.insulinTable.units')}
              </th>
              <th className="border border-[hsl(var(--border))] px-3 py-2 text-left font-bold">
                {t('insulinDosage.insulinTable.specialNotes')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                {ranges.range1}
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <input
          disabled={disabled}

                  type="number"
                  value={insulinDoses[mealKey]?.range1 || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'range1', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder={t('insulinDosage.insulinTable.unitsPlaceholder')}
                />
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <textarea
          disabled={disabled}

                  value={specialNotes[mealKey]?.range1 || ''}
                  onChange={e =>
                    handleSpecialNoteChange(mealKey, 'range1', e.target.value)
                  }
                  className="w-full border-0 bg-transparent resize-none text-sm"
                  rows={2}
                  placeholder={t(
                    'insulinDosage.insulinTable.specialNotesPlaceholder'
                  )}
                />
              </td>
            </tr>

            <tr>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                {ranges.range2}
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <input
          disabled={disabled}

                  type="number"
                  value={insulinDoses[mealKey]?.range2 || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'range2', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder={t('insulinDosage.insulinTable.unitsPlaceholder')}
                />
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <textarea
          disabled={disabled}

                  value={specialNotes[mealKey]?.range2 || ''}
                  onChange={e =>
                    handleSpecialNoteChange(mealKey, 'range2', e.target.value)
                  }
                  className="w-full border-0 bg-transparent resize-none text-sm"
                  rows={2}
                  placeholder={t(
                    'insulinDosage.insulinTable.specialNotesPlaceholder'
                  )}
                />
              </td>
            </tr>

            <tr>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                {ranges.range3}
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <input
          disabled={disabled}

                  type="number"
                  value={insulinDoses[mealKey]?.range3 || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'range3', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder={t('insulinDosage.insulinTable.unitsPlaceholder')}
                />
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <textarea
          disabled={disabled}

                  value={specialNotes[mealKey]?.range3 || ''}
                  onChange={e =>
                    handleSpecialNoteChange(mealKey, 'range3', e.target.value)
                  }
                  className="w-full border-0 bg-transparent resize-none text-sm"
                  rows={2}
                  placeholder={t(
                    'insulinDosage.insulinTable.specialNotesPlaceholder'
                  )}
                />
              </td>
            </tr>

            <tr>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                {ranges.range4}
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <input
          disabled={disabled}

                  type="number"
                  value={insulinDoses[mealKey]?.range4 || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'range4', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder={t('insulinDosage.insulinTable.unitsPlaceholder')}
                />
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <textarea
          disabled={disabled}

                  value={specialNotes[mealKey]?.range4 || ''}
                  onChange={e =>
                    handleSpecialNoteChange(mealKey, 'range4', e.target.value)
                  }
                  className="w-full border-0 bg-transparent resize-none text-sm"
                  rows={2}
                  placeholder={t(
                    'insulinDosage.insulinTable.specialNotesPlaceholder'
                  )}
                />
              </td>
            </tr>

            <tr>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                {ranges.range5}
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <input
          disabled={disabled}

                  type="number"
                  value={insulinDoses[mealKey]?.range5 || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'range5', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder={t('insulinDosage.insulinTable.unitsPlaceholder')}
                />
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <textarea
          disabled={disabled}

                  value={specialNotes[mealKey]?.range5 || ''}
                  onChange={e =>
                    handleSpecialNoteChange(mealKey, 'range5', e.target.value)
                  }
                  className="w-full border-0 bg-transparent resize-none text-sm"
                  rows={2}
                  placeholder={t(
                    'insulinDosage.insulinTable.specialNotesPlaceholder'
                  )}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-3 py-1 inline-block font-bold mb-2">
          {t('insulinDosage.snackSection.title')}
        </div>

        <div className="text-sm mb-2">
          {t('insulinDosage.snackSection.fixedDoseText')} ( ______ ){' '}
          {t('insulinDosage.snackSection.penColour')}
        </div>

        <table className="w-full border-collapse border border-[hsl(var(--border))] mb-4 max-w-md">
          <thead>
            <tr className="bg-[hsl(var(--muted))]">
              <th className="border border-[hsl(var(--border))] px-3 py-2 text-left font-bold">
                {t('insulinDosage.snackSection.bloodSugar')} ({glucoseUnit})
              </th>
              <th className="border border-[hsl(var(--border))] px-3 py-2 text-left font-bold">
                {t('insulinDosage.snackSection.units')}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                {mealKey === 'breakfast'
                  ? ranges.snackBreakfast
                  : mealKey === 'lunch'
                    ? ranges.snackLunch
                    : ranges.snackSupper}
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <input
          disabled={disabled}

                  type="number"
                  value={insulinDoses[mealKey]?.snack || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'snack', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder={t('insulinDosage.snackSection.unitsPlaceholder')}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );

    return (
      <div className="bg-card text-foreground rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
        {/* Header with Unit Toggle */}
        <div className="mb-6 border-b pb-4">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">
                {t('insulinDosage.insulinSheet.title')}
              </h2>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {t('insulinDosage.insulinSheet.rapidActing')}
              </h3>

              <div className="mb-3">
                <label className="block text-sm font-medium text-foreground mb-1">
                  {t('insulinDosage.insulinSheet.patientName')}
                </label>
                <input
          disabled={disabled}

                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-foreground bg-background "
                  placeholder={t(
                    'insulinDosage.insulinSheet.patientNamePlaceholder'
                  )}
                />
              </div>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="text-sm font-medium mr-2">
                  {t('insulinDosage.insulinSheet.glucoseUnits')}
                </span>
                <button
                  onClick={() => setGlucoseUnit('mg/dL')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    glucoseUnit === 'mg/dL'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  mg/dL
                </button>
                <button
                  onClick={() => setGlucoseUnit('mmol/L')}
                  className={`ml-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    glucoseUnit === 'mmol/L'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  mmol/L
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {t('insulinDosage.insulinSheet.switchUnits')}
              </p>
            </div>
          </div>
          <p className="text-sm text-foreground">
            {t('insulinDosage.insulinSheet.measurements', {
              unit: glucoseUnit,
            })}{' '}
          </p>
        </div>

        {/* Meal Sections */}
        <MealSection
          mealName={t('insulinDosage.meals.breakfast')}
          mealKey="breakfast"
          ranges={ranges}
          insulinDoses={insulinDoses}
          penColors={penColors}
        />

        <MealSection
          mealName={t('insulinDosage.meals.lunch')}
          mealKey="lunch"
          ranges={ranges}
          insulinDoses={insulinDoses}
          penColors={penColors}
        />

        <MealSection
          mealName={t('insulinDosage.meals.supper')}
          mealKey="supper"
          ranges={ranges}
          insulinDoses={insulinDoses}
          penColors={penColors}
        />

        {/* Bedtime */}
        <div className="mb-6">
          <div className="bg-background text-foreground px-3 py-1 inline-block font-bold mb-2">
            {t('insulinDosage.meals.bedtime')}
          </div>
          <div className="text-sm mb-2 flex items-center gap-2">
            {t('insulinDosage.insulin.fixedDoseClear')} (
            <input
          disabled={disabled}

              type="text"
              value={penColors.bedtime || ''}
              onChange={e => handlePenColorChange('bedtime', e.target.value)}
              className="border border-border bg-background focus:ring focus:ring-accent focus:border-0 px-1 py-0.5 w-20 text-center"
              placeholder={t('placeholders.type')}
            />
            ) {t('insulinDosage.insulin.penColour')}
            <input
          disabled={disabled}

              type="text"
              value={penColors.bedtime_color || ''}
              onChange={e =>
                handlePenColorChange('bedtime_color', e.target.value)
              }
              className="border border-border bg-background focus:ring focus:ring-accent focus:border-0 px-1 py-0.5 w-20 text-center"
              placeholder={t('insulinDosage.placeholders.color')}
            />
          </div>

          <table className="w-full border-collapse border border-border mb-4 max-w-md">
            <thead>
              <tr className="bg-muted">
                <th className="border border-gray-400 px-3 py-2 text-left font-bold">
                  {t('insulinDosage.units.label')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-3 py-2">
                  <input
          disabled={disabled}

                    type="number"
                    value={insulinDoses.bedtime || ''}
                    onChange={e =>
                      setInsulinDoses(prev => ({
                        ...prev,
                        bedtime: e.target.value,
                      }))
                    }
                    className="w-full border-0 bg-transparent text-center"
                    placeholder={t('insulinDosage.placeholders.units')}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Doctor's Notes and Recommendations */}
        <div className="mb-6 bg-muted rounded-lg p-6 border border-blue-200">
          <div className="flex items-center mb-4">
            <FileText className="text-foreground mr-2" size={24} />
            <h3 className="text-xl font-bold text-foreground">
              {t('insulinDosage.notes.doctorsNotes')}
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('insulinDosage.notes.generalNotes')}
                </label>
                <textarea
          disabled={disabled}

                  value={doctorNotes.generalNotes || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      generalNotes: e.target.value,
                    }))
                  }
                  placeholder={t('insulinDosage.notes.patientCondition')}
                  className="w-full h-24 px-3 py-2 border border-gray bg-background text0foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('insulinDosage.notes.clinicalObservations')}
                </label>
                <textarea
          disabled={disabled}

                  value={doctorNotes.observations || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      observations: e.target.value,
                    }))
                  }
                  placeholder={t('insulinDosage.notes.bloodGlucosePatterns')}
                  className="w-full h-24 px-3 py-2 border border-gray bg-background text0foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('insulinDosage.notes.emergencyContact')}
                </label>
                <textarea
          disabled={disabled}

                  value={doctorNotes.emergencyContact || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      emergencyContact: e.target.value,
                    }))
                  }
                  placeholder={t(
                    'insulinDosage.notes.emergencyContactPlaceholder'
                  )}
                  className="w-full h-24 px-3 py-2 border border-gray bg-background text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('insulinDosage.notes.treatmentRecommendations')}
                </label>
                <textarea
          disabled={disabled}

                  value={doctorNotes.recommendations || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      recommendations: e.target.value,
                    }))
                  }
                  placeholder={t(
                    'insulinDosage.notes.treatmentRecommendationsPlaceholder'
                  )}
                  className="w-full h-24 px-3 py-2 border border-gray bg-background text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('insulinDosage.notes.specialInstructions')}
                </label>
                <textarea
          disabled={disabled}

                  value={doctorNotes.specialInstructions || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      specialInstructions: e.target.value,
                    }))
                  }
                  placeholder={t(
                    'insulinDosage.notes.specialInstructionsPlaceholder'
                  )}
                  className="w-full h-24 px-3 py-2 border border-gray bg-background text-foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  {t('insulinDosage.notes.followUpAppointment')}
                </label>
                <input
          disabled={disabled}

                  type="date"
                  value={doctorNotes.followUpDate || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      followUpDate: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-accent rounded-lg focus:ring-2 focus:ring-accent focus:border-accent bg-background"
                />
              </div>
            </div>
          </div>

          {/* Quick Notes Section */}
          <div className="mt-6 p-4 bg-background rounded-lg border border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-3">
              {t('insulinDosage.quickReference.title')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                <div className="font-medium text-red-800">
                  {t('insulinDosage.quickReference.hypoTitle')}
                </div>
                <div className="text-red-600 text-xs mt-1">
                  {t('insulinDosage.quickReference.hypoSigns')}
                </div>
              </div>

              <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-400">
                <div className="font-medium text-orange-800">
                  {t('insulinDosage.quickReference.hyperTitle')}
                </div>
                <div className="text-orange-600 text-xs mt-1">
                  {t('insulinDosage.quickReference.hyperSigns')}
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                <div className="font-medium text-blue-800">
                  {t('insulinDosage.quickReference.ketoneTitle')}
                </div>
                <div className="text-blue-600 text-xs mt-1">
                  {t('insulinDosage.quickReference.ketoneInstruction')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          <div className="text-sm mb-4">
            {t('insulinDosage.caregiverTraining.message')}
          </div>

          <table className="w-full border-collapse border border-gray-400 mb-4">
            <thead>
              <tr className="bg-muted">
                <th className="border border-gray-400 px-3 py-2 text-left font-bold">
                  {t('insulinDosage.doctorSection.healthProfessional')}
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left font-bold">
                  {t('insulinDosage.doctorSection.nameInPrint')}
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left font-bold">
                  {t('insulinDosage.doctorSection.signature')}
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left font-bold">
                  {t('insulinDosage.doctorSection.dateFormat')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-3 py-2 h-12">
                  {t('insulinDosage.doctorSection.doctor')}
                </td>
                <td className="border border-gray-400 px-3 py-2">
                  <input
          disabled={disabled}

                    type="text"
                    value={doctorInfo.name || ''}
                    onChange={e =>
                      setDoctorInfo(prev => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full border-0 bg-transparent"
                    placeholder={t('insulinDosage.doctorSection.enterName')}
                  />
                </td>
                <td className="border border-gray-400 px-3 py-2">
                  <input
          disabled={disabled}

                    type="text"
                    value={doctorInfo.signature || ''}
                    onChange={e =>
                      setDoctorInfo(prev => ({
                        ...prev,
                        signature: e.target.value,
                      }))
                    }
                    className="w-full border-0 bg-transparent"
                    placeholder={t('insulinDosage.doctorSection.signature')}
                  />
                </td>

                <td className="border border-gray-400 px-3 py-2">
                  <input
          disabled={disabled}

                    type="date"
                    value={doctorInfo.date || ''}
                    onChange={e =>
                      setDoctorInfo(prev => ({ ...prev, date: e.target.value }))
                    }
                    className="w-full border-0 bg-transparent"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-sm font-medium text-center bg-muted text-foreground p-3 rounded border">
            {t('insulinDosage.doctorSection.keepSheetAccessible')}
          </div>

          {/* Save and Print Options */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText size={16} />
              {t('insulinDosage.doctorSection.printSheet')}
            </button>

            <button
              onClick={() => {
                const data = {
                  insulinDoses,
                  penColors,
                  doctorInfo,
                  doctorNotes,
                  specialNotes,
                  glucoseUnit,
                  date: new Date().toISOString(),
                };
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'insulin-dose-sheet.json';
                link.click();
              }}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Database size={16} />
              {t('insulinDosage.doctorSection.saveData')}
            </button>

            <button
              onClick={shareWithDoctor}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Share2 size={16} />
              {t('insulinDosage.doctorSection.shareWithDoctor')}
            </button>
          </div>

          {/* Share Instructions */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 text-center">
              💡 <strong>{t('insulinDosage.shareInfo.title')}</strong>{' '}
              {t('insulinDosage.shareInfo.description')}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-background rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('insulinDosage.dashboard.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('insulinDosage.dashboard.subtitle')}
          </p>

          {/* Tab Navigation */}
          <div className="flex mt-4 border-b">
            <button
              onClick={() => setActiveTab('monitoring')}
              className={`px-6 py-2 font-medium transition-colors ${
                activeTab === 'monitoring'
                  ? 'text-accent-foreground border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Activity className="inline mr-2" size={20} />
              {t('insulinDosage.dashboard.tabs.monitoring')}
            </button>
            <button
              onClick={() => setActiveTab('dosage')}
              className={`px-6 py-2 font-medium transition-colors ${
                activeTab === 'dosage'
                  ? 'text-accent-foreground border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="inline mr-2" size={20} />
              {t('insulinDosage.dashboard.tabs.dosage')}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'monitoring' ? (
<></>
        ) : (
          <InsulinDoseSheet />
        )}
      </div>
    </div>
  );
};

export default DiabetesMonitoringApp;
