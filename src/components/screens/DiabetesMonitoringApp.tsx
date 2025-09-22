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

const DiabetesMonitoringApp = () => {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [currentGlucose, setCurrentGlucose] = useState(120);
  const [insulin, setInsulin] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [activity, setActivity] = useState(0);
  const [alertSettings, setAlertSettings] = useState({
    lowThreshold: 70,
    highThreshold: 180,
  });
  const [glucoseData, setGlucoseData] = useState([
    { time: '08:00', glucose: 95, predicted: false },
    { time: '08:30', glucose: 110, predicted: false },
    { time: '09:00', glucose: 125, predicted: false },
    { time: '09:30', glucose: 140, predicted: false },
    { time: '10:00', glucose: 120, predicted: false },
  ]);
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
      range1: 'Treat hypoglycemia first. When corrected give this dose.',
      range2: '',
      range3: '',
      range4: '',
      range5: 'Check for ketones',
    },
    lunch: {
      range1: 'Treat hypoglycemia first. When corrected give this dose.',
      range2: '',
      range3: '',
      range4: '',
      range5: 'Check for ketones',
    },
    supper: {
      range1: 'Treat hypoglycemia first. When corrected give this dose.',
      range2: '',
      range3: '',
      range4: '',
      range5: 'Check for ketones',
    },
  });
  const [patientName, setPatientName] = useState('');

  // Simulate AI prediction engine
  const generatePrediction = (glucose, insulin, carbs, activity) => {
    let predictedGlucose = glucose;

    // Simple prediction logic (in reality, this would be a complex ML model)
    if (carbs > 30) predictedGlucose += carbs * 1.5;
    if (insulin > 0) predictedGlucose -= insulin * 8;
    if (activity > 0) predictedGlucose -= activity * 2;

    // Add some realistic variation
    predictedGlucose += (Math.random() - 0.5) * 20;

    return Math.max(50, Math.min(300, Math.round(predictedGlucose)));
  };

  // Check for alerts
  const checkAlerts = predictedValue => {
    const newAlerts = [];

    if (predictedValue < alertSettings.lowThreshold) {
      newAlerts.push({
        id: Date.now(),
        type: 'hypo',
        message: `Hypoglycemia predicted! Expected glucose: ${predictedValue} mg/dL`,
        severity: 'high',
      });
    } else if (predictedValue > alertSettings.highThreshold) {
      newAlerts.push({
        id: Date.now() + 1,
        type: 'hyper',
        message: `Hyperglycemia predicted! Expected glucose: ${predictedValue} mg/dL`,
        severity: 'medium',
      });
    }

    setAlerts(prev => [...newAlerts, ...prev.slice(0, 4)]);
  };

  // Add new glucose reading
  const addGlucoseReading = () => {
    const currentTime = new Date();
    const timeStr = currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const predictedValue = generatePrediction(
      currentGlucose,
      insulin,
      carbs,
      activity
    );
    setPrediction(predictedValue);
    checkAlerts(predictedValue);

    const newReading = {
      time: timeStr,
      glucose: currentGlucose,
      predicted: false,
    };

    const predictionReading = {
      time: new Date(currentTime.getTime() + 30 * 60000).toLocaleTimeString(
        'en-US',
        {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }
      ),
      glucose: predictedValue,
      predicted: true,
    };

    setGlucoseData(prev => [...prev.slice(-9), newReading, predictionReading]);

    // Reset inputs
    setInsulin(0);
    setCarbs(0);
    setActivity(0);
  };

  // Glucose unit conversion functions
  const getGlucoseRanges = unit => {
    if (unit === 'mg/dL') {
      return {
        range1: '70 or less',
        range2: '72 - 144',
        range3: '145 - 216',
        range4: '217 - 306',
        range5: '307 or more',
        snackBreakfast: '72 or more',
        snackLunch: '72 or more',
        snackSupper: '108 or more',
      };
    } else {
      return {
        range1: '3.9 or less',
        range2: '4.0 - 8.0',
        range3: '8.1 - 12.0',
        range4: '12.1 - 17.0',
        range5: '17.1 or more',
        snackBreakfast: '4.0 or more',
        snackLunch: '4.0 or more',
        snackSupper: '6.0 or more',
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
    const ranges = getGlucoseRanges(glucoseUnit);
    const patientDisplayName = patientName || 'Patient';

    const shareText = `
🏥 INSULIN DOSE SHEET
Patient: ${patientDisplayName}
Date: ${new Date().toLocaleDateString()}
Units: ${glucoseUnit}

=== BREAKFAST ===
${ranges.range1}: ${insulinDoses.breakfast?.range1 || 'Not set'} units
${ranges.range2}: ${insulinDoses.breakfast?.range2 || 'Not set'} units
${ranges.range3}: ${insulinDoses.breakfast?.range3 || 'Not set'} units
${ranges.range4}: ${insulinDoses.breakfast?.range4 || 'Not set'} units
${ranges.range5}: ${insulinDoses.breakfast?.range5 || 'Not set'} units
Snack: ${insulinDoses.breakfast?.snack || 'Not set'} units

=== LUNCH ===
${ranges.range1}: ${insulinDoses.lunch?.range1 || 'Not set'} units
${ranges.range2}: ${insulinDoses.lunch?.range2 || 'Not set'} units
${ranges.range3}: ${insulinDoses.lunch?.range3 || 'Not set'} units
${ranges.range4}: ${insulinDoses.lunch?.range4 || 'Not set'} units
${ranges.range5}: ${insulinDoses.lunch?.range5 || 'Not set'} units
Snack: ${insulinDoses.lunch?.snack || 'Not set'} units

=== SUPPER ===
${ranges.range1}: ${insulinDoses.supper?.range1 || 'Not set'} units
${ranges.range2}: ${insulinDoses.supper?.range2 || 'Not set'} units
${ranges.range3}: ${insulinDoses.supper?.range3 || 'Not set'} units
${ranges.range4}: ${insulinDoses.supper?.range4 || 'Not set'} units
${ranges.range5}: ${insulinDoses.supper?.range5 || 'Not set'} units
Snack: ${insulinDoses.supper?.snack || 'Not set'} units

=== BEDTIME ===
Basal insulin: ${insulinDoses.bedtime || 'Not set'} units

🩺 HEALTHCARE PROVIDER
Doctor: ${doctorInfo.name || 'Not specified'}
Date: ${doctorInfo.date || 'Not specified'}

📝 DOCTOR'S NOTES
${
  doctorNotes.recommendations
    ? 'Recommendations: ' + doctorNotes.recommendations + '\n'
    : ''
}${
      doctorNotes.specialInstructions
        ? 'Special Instructions: ' + doctorNotes.specialInstructions + '\n'
        : ''
    }${
      doctorNotes.followUpDate
        ? 'Next Appointment: ' +
          new Date(doctorNotes.followUpDate).toLocaleDateString()
        : ''
    }

Generated from Diabetes Management System
`.trim();

    if (navigator.share) {
      navigator.share({
        title: `Insulin Dose Sheet - ${patientDisplayName}`,
        text: shareText,
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        alert(
          '✅ Insulin dose sheet copied to clipboard!\n\nYou can now paste it in:\n• Email to your doctor\n• WhatsApp/SMS message\n• Medical app or portal'
        );
      });
    } else {
      // Fallback - create downloadable file
      const blob = new Blob([shareText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `insulin-dose-sheet-${patientDisplayName.replace(
        /\s+/g,
        '-'
      )}.txt`;
      link.click();
    }
  };

  // Insulin Dose Sheet Component
  const InsulinDoseSheet = () => {
    const ranges = getGlucoseRanges(glucoseUnit);

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
          Sliding scale for clear rapid-acting insulin (
          <input
            type="text"
            value={penColors[mealKey] || ''}
            onChange={e => handlePenColorChange(mealKey, e.target.value)}
            className="border border-border bg-background focus:ring focus:ring-accent focus:border-0 px-1 py-0.5 w-20 text-center"
            placeholder="type"
          />
          ) pen colour
          <input
            type="text"
            value={penColors[mealKey + '_color'] || ''}
            onChange={e =>
              handlePenColorChange(mealKey + '_color', e.target.value)
            }
            className="border  border-border bg-background focus:ring focus:ring-accent focus:border-0 px-1 py-0.5 w-20 text-center"
            placeholder="color"
          />
        </div>

        <table className="w-full border-collapse border border-[hsl(var(--border))] mb-2">
          <thead>
            <tr className="bg-[hsl(var(--muted))]">
              <th className="border border-[hsl(var(--border))] px-3 py-2 text-left font-bold">
                Blood sugar ({glucoseUnit})
              </th>
              <th className="border border-[hsl(var(--border))] px-3 py-2 text-left font-bold">
                Units
              </th>
              <th className="border border-[hsl(var(--border))] px-3 py-2 text-left font-bold">
                Special notes
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
                  type="number"
                  value={insulinDoses[mealKey]?.range1 || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'range1', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder="units"
                />
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <textarea
                  value={specialNotes[mealKey]?.range1 || ''}
                  onChange={e =>
                    handleSpecialNoteChange(mealKey, 'range1', e.target.value)
                  }
                  className="w-full border-0 bg-transparent resize-none text-sm"
                  rows={2}
                  placeholder="Add special instructions..."
                />
              </td>
            </tr>

            <tr>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                {ranges.range2}
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <input
                  type="number"
                  value={insulinDoses[mealKey]?.range2 || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'range2', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder="units"
                />
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <textarea
                  value={specialNotes[mealKey]?.range2 || ''}
                  onChange={e =>
                    handleSpecialNoteChange(mealKey, 'range2', e.target.value)
                  }
                  className="w-full border-0 bg-transparent resize-none text-sm"
                  rows={2}
                  placeholder="Add special instructions..."
                />
              </td>
            </tr>

            <tr>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                {ranges.range3}
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <input
                  type="number"
                  value={insulinDoses[mealKey]?.range3 || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'range3', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder="units"
                />
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <textarea
                  value={specialNotes[mealKey]?.range3 || ''}
                  onChange={e =>
                    handleSpecialNoteChange(mealKey, 'range3', e.target.value)
                  }
                  className="w-full border-0 bg-transparent resize-none text-sm"
                  rows={2}
                  placeholder="Add special instructions..."
                />
              </td>
            </tr>

            <tr>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                {ranges.range4}
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <input
                  type="number"
                  value={insulinDoses[mealKey]?.range4 || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'range4', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder="units"
                />
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <textarea
                  value={specialNotes[mealKey]?.range4 || ''}
                  onChange={e =>
                    handleSpecialNoteChange(mealKey, 'range4', e.target.value)
                  }
                  className="w-full border-0 bg-transparent resize-none text-sm"
                  rows={2}
                  placeholder="Add special instructions..."
                />
              </td>
            </tr>

            <tr>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                {ranges.range5}
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <input
                  type="number"
                  value={insulinDoses[mealKey]?.range5 || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'range5', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder="units"
                />
              </td>
              <td className="border border-[hsl(var(--border))] px-3 py-2">
                <textarea
                  value={specialNotes[mealKey]?.range5 || ''}
                  onChange={e =>
                    handleSpecialNoteChange(mealKey, 'range5', e.target.value)
                  }
                  className="w-full border-0 bg-transparent resize-none text-sm"
                  rows={2}
                  placeholder="Add special instructions..."
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] px-3 py-1 inline-block font-bold mb-2">
          Snack
        </div>
        <div className="text-sm mb-2">
          Fixed dose clear rapid-acting insulin ( ______ ) pen colour _______
        </div>
        <table className="w-full border-collapse border border-[hsl(var(--border))] mb-4 max-w-md">
          <thead>
            <tr className="bg-[hsl(var(--muted))]">
              <th className="border border-[hsl(var(--border))] px-3 py-2 text-left font-bold">
                Blood sugar ({glucoseUnit})
              </th>
              <th className="border border-[hsl(var(--border))] px-3 py-2 text-left font-bold">
                Units
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
                  type="number"
                  value={insulinDoses[mealKey]?.snack || ''}
                  onChange={e =>
                    handleInsulinDoseChange(mealKey, 'snack', e.target.value)
                  }
                  className="w-full border-0 bg-transparent text-center"
                  placeholder="units"
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
              <h2 className="text-2xl font-bold mb-1">Insulin Dose Sheet</h2>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Rapid-acting insulin
              </h3>

              <div className="mb-3">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-foreground bg-background "
                  placeholder="Enter patient name"
                />
              </div>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="text-sm font-medium mr-2">Glucose Units:</span>
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
              <p className="text-xs text-gray-500">Click to switch units</p>
            </div>
          </div>
          <p className="text-sm text-foreground">
            For blood glucose measurements in {glucoseUnit}
          </p>
        </div>

        {/* Meal Sections */}
        <MealSection
          mealName="Breakfast"
          mealKey="breakfast"
          ranges={ranges}
          insulinDoses={insulinDoses}
          penColors={penColors}
        />

        <MealSection
          mealName="Lunch"
          mealKey="lunch"
          ranges={ranges}
          insulinDoses={insulinDoses}
          penColors={penColors}
        />

        <MealSection
          mealName="Supper"
          mealKey="supper"
          ranges={ranges}
          insulinDoses={insulinDoses}
          penColors={penColors}
        />

        {/* Bedtime */}
        <div className="mb-6">
          <div className="bg-background text-foreground px-3 py-1 inline-block font-bold mb-2">
            Bedtime
          </div>
          <div className="text-sm mb-2 flex items-center gap-2">
            Fixed dose clear basal-acting insulin (
            <input
              type="text"
              value={penColors.bedtime || ''}
              onChange={e => handlePenColorChange('bedtime', e.target.value)}
              className="border border-border bg-background focus:ring focus:ring-accent focus:border-0 px-1 py-0.5 w-20 text-center"
              placeholder="type"
            />
            ) pen colour
            <input
              type="text"
              value={penColors.bedtime_color || ''}
              onChange={e =>
                handlePenColorChange('bedtime_color', e.target.value)
              }
              className="border border-border bg-background focus:ring focus:ring-accent focus:border-0 px-1 py-0.5 w-20 text-center"
              placeholder="color"
            />
          </div>

          <table className="w-full border-collapse border border-border mb-4 max-w-md">
            <thead>
              <tr className="bg-muted">
                <th className="border border-gray-400 px-3 py-2 text-left font-bold">
                  Units
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-3 py-2">
                  <input
                    type="number"
                    value={insulinDoses.bedtime || ''}
                    onChange={e =>
                      setInsulinDoses(prev => ({
                        ...prev,
                        bedtime: e.target.value,
                      }))
                    }
                    className="w-full border-0 bg-transparent text-center"
                    placeholder="units"
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
              Doctor's Notes & Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  General Notes
                </label>
                <textarea
                  value={doctorNotes.generalNotes || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      generalNotes: e.target.value,
                    }))
                  }
                  placeholder="Patient's current condition, general observations..."
                  className="w-full h-24 px-3 py-2 border border-gray bg-background text0foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Clinical Observations
                </label>
                <textarea
                  value={doctorNotes.observations || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      observations: e.target.value,
                    }))
                  }
                  placeholder="Blood glucose patterns, HbA1c levels, symptoms observed..."
                  className="w-full h-24 px-3 py-2 border border-gray bg-background text0foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Emergency Contact Instructions
                </label>
                <textarea
                  value={doctorNotes.emergencyContact || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      emergencyContact: e.target.value,
                    }))
                  }
                  placeholder="When to call emergency services, doctor contact info..."
                  className="w-full h-24 px-3 py-2 border border-gray bg-background text0foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Treatment Recommendations
                </label>
                <textarea
                  value={doctorNotes.recommendations || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      recommendations: e.target.value,
                    }))
                  }
                  placeholder="Dietary recommendations, exercise guidelines, medication adjustments..."
                  className="w-full h-24 px-3 py-2 border border-gray bg-background text0foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={doctorNotes.specialInstructions || ''}
                  onChange={e =>
                    setDoctorNotes(prev => ({
                      ...prev,
                      specialInstructions: e.target.value,
                    }))
                  }
                  placeholder="Sick day management, travel instructions, special situations..."
                  className="w-full h-24 px-3 py-2 border border-gray bg-background text0foreground rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Next Follow-up Appointment
                </label>
                <input
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
              Quick Reference Guidelines
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-red-50 rounded border-l-4 border-red-400">
                <div className="font-medium text-red-800">
                  Hypoglycemia Signs
                </div>
                <div className="text-red-600 text-xs mt-1">
                  Sweating, shaking, confusion, rapid heartbeat
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-400">
                <div className="font-medium text-orange-800">
                  Hyperglycemia Signs
                </div>
                <div className="text-orange-600 text-xs mt-1">
                  Excessive thirst, frequent urination, fatigue
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                <div className="font-medium text-blue-800">Ketone Testing</div>
                <div className="text-blue-600 text-xs mt-1">
                  Test when blood sugar {'>'} 250 mg/dL (13.9 mmol/L)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t pt-4">
          <div className="text-sm mb-4">
            Parents/caregivers have received training to adjust the insulin.
            They are skilled in changing insulin dosages according to the
            patient's needs.
          </div>

          <table className="w-full border-collapse border border-gray-400 mb-4">
            <thead>
              <tr className="bg-muted">
                <th className="border border-gray-400 px-3 py-2 text-left font-bold">
                  Health care professional
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left font-bold">
                  Name in print letters
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left font-bold">
                  Signature
                </th>
                <th className="border border-gray-400 px-3 py-2 text-left font-bold">
                  Date DD/MM/YYYY
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-3 py-2 h-12">
                  Doctor
                </td>
                <td className="border border-gray-400 px-3 py-2">
                  <input
                    type="text"
                    value={doctorInfo.name || ''}
                    onChange={e =>
                      setDoctorInfo(prev => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full border-0 bg-transparent"
                    placeholder="Enter name"
                  />
                </td>
                <td className="border border-gray-400 px-3 py-2">
                  <input
                    type="text"
                    value={doctorInfo.signature || ''}
                    onChange={e =>
                      setDoctorInfo(prev => ({
                        ...prev,
                        signature: e.target.value,
                      }))
                    }
                    className="w-full border-0 bg-transparent"
                    placeholder="Signature"
                  />
                </td>
                <td className="border border-gray-400 px-3 py-2">
                  <input
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
            Keep this sheet accessible at all times - For medical reference only
          </div>

          {/* Save and Print Options */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => window.print()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText size={16} />
              Print Sheet
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
              Save Data
            </button>
            <button
              onClick={shareWithDoctor}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Share2 size={16} />
              Share with Doctor
            </button>
          </div>

          {/* Share Instructions */}
          <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-700 text-center">
              💡 <strong>Share with Doctor:</strong> Copies your insulin doses
              and notes to clipboard, then paste in email, WhatsApp, or text
              message to your healthcare provider.
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
            Diabetes Management System
          </h1>
          <p className="text-muted-foreground">
            Real-time glucose monitoring with AI-powered predictions
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
              Monitoring
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
              Insulin Dose Sheet
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'monitoring' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Manual Input */}
              <div className="bg-background rounded-xl shadow-lg p-6">
                <div className="flex  items-center mb-4">
                  <Droplets className="text-blue-500 mr-2" size={24} />
                  <h2 className="text-xl text-foreground font-semibold">
                    Patient Manual Input
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Current Glucose (mg/dL)
                    </label>
                    <input
                      type="number"
                      value={currentGlucose}
                      onChange={e => setCurrentGlucose(Number(e.target.value))}
                      className="w-full px-3 py-2 text-foreground bg-background border border-accent rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      <Syringe className="inline mr-1" size={16} />
                      Insulin (units)
                    </label>
                    <input
                      type="number"
                      value={insulin}
                      onChange={e => setInsulin(Number(e.target.value))}
                      className="w-full px-3 py-2 text-foreground bg-background border border-accent rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      <Utensils className="inline mr-1" size={16} />
                      Carbs (grams)
                    </label>
                    <input
                      type="number"
                      value={carbs}
                      onChange={e => setCarbs(Number(e.target.value))}
                      className="w-full px-3 py-2 text-foreground bg-background border border-accent rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      <Activity className="inline mr-1" size={16} />
                      Activity (minutes)
                    </label>
                    <input
                      type="number"
                      value={activity}
                      onChange={e => setActivity(Number(e.target.value))}
                      className="w-full px-3 py-2 text-foreground bg-background border border-accent rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                  </div>

                  <button
                    onClick={addGlucoseReading}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Add Reading & Generate Prediction
                  </button>
                </div>
              </div>

              {/* Alert Settings */}
              <div className="bg-background rounded-xl shadow-lg p-6">
                <div className="flex text-foreground items-center mb-4">
                  <Settings className="text-orange-500 mr-2" size={24} />
                  <h2 className="text-xl font-semibold">Alert Settings</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Low Threshold (mg/dL)
                    </label>
                    <input
                      type="number"
                      value={alertSettings.lowThreshold}
                      onChange={e =>
                        setAlertSettings(prev => ({
                          ...prev,
                          lowThreshold: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 text-foreground bg-background border border-accent rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      High Threshold (mg/dL)
                    </label>
                    <input
                      type="number"
                      value={alertSettings.highThreshold}
                      onChange={e =>
                        setAlertSettings(prev => ({
                          ...prev,
                          highThreshold: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 text-foreground bg-background border border-accent rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* AI Prediction */}
              <div className="bg-background rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Brain className="text-purple-500 mr-2" size={24} />
                  <h2 className="text-xl text-foreground font-semibold">
                    AI Prediction Engine
                  </h2>
                </div>

                {prediction && (
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Next 30-minute prediction:
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {prediction} mg/dL
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Based on time-series analysis + rule-based factors
                    </p>
                  </div>
                )}
              </div>

              {/* Doctor's Recommendations Display */}
              {(doctorNotes.recommendations ||
                doctorNotes.specialInstructions) && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="text-blue-500 mr-2" size={24} />
                    <h2 className="text-xl font-semibold">
                      Doctor's Recommendations
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {doctorNotes.recommendations && (
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <h3 className="font-medium text-blue-800 mb-2">
                          Treatment Recommendations
                        </h3>
                        <p className="text-sm text-blue-700">
                          {doctorNotes.recommendations}
                        </p>
                      </div>
                    )}

                    {doctorNotes.specialInstructions && (
                      <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                        <h3 className="font-medium text-amber-800 mb-2">
                          Special Instructions
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
                            Next Appointment:{' '}
                          </span>
                          <span className="ml-2 text-sm">
                            {new Date(
                              doctorNotes.followUpDate
                            ).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Main Display */}
            <div className="lg:col-span-2 space-y-6">
              {/* Real-Time Graph */}
              <div className="bg-background rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Activity className="text-green-500 mr-2" size={24} />
                  <h2 className="text-xl font-semibold">
                    Real-Time Blood Glucose
                  </h2>
                </div>

                <div className="h-64 text-foreground">
                 
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

                      {/* Tooltip + Legend */}
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
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
                        dot={(props) => {
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
                    Actual readings
                  </span>
                  <span className="flex items-center text-foreground">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    AI predictions
                  </span>
                </div>
              </div>

              {/* Alerts System */}
              <div className="bg-background rounded-xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Bell className="text-red-500 mr-2" size={24} />
                  <h2 className="text-xl text-foreground font-semibold">
                    Alerts System
                  </h2>
                </div>

                {alerts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No active alerts
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
                              ? 'Hypoglycemia Alert'
                              : 'Hyperglycemia Alert'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {alert.message}
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
                    Historical Database
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-foreground">Total Readings</p>
                    <p className="text-xl font-bold text-muted-foreground">
                      {glucoseData.length}
                    </p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-foreground">Data Points Today</p>
                    <p className="text-xl font-bold text-muted-foreground">
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
    </div>
  );
};

export default DiabetesMonitoringApp;
