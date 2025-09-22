import React, { useState } from 'react';
import {
  Activity,
  Brain,
  FileText,
  Bell,
  AlertTriangle,
  Database,
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

// ✅ Placeholder component for InsulinDoseSheet (replace with your actual one)
const InsulinDoseSheet = () => (
  <div className="p-6 bg-gray-100 rounded-lg text-center">
    <p className="text-gray-600">Insulin Dose Sheet goes here</p>
  </div>
);

const Biomarkers = () => {
  // ✅ Example biomarker state
  const [biomarkers, setBiomarkers] = useState({
    hba1c: '',
    hba1cDate: '',
    systolicBP: '',
    diastolicBP: '',
    bpDate: '',
    weight: '',
    height: '',
    weightDate: '',
    bmi: '',
    totalCholesterol: '',
    hdlCholesterol: '',
    ldlCholesterol: '',
    triglycerides: '',
    cholesterolDate: '',
    creatinine: '',
    creatinineDate: '',
    microalbumin: '',
    lastEyeExam: '',
    lastFootExam: '',
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
    if (!bmi) return { category: 'Not set', color: 'text-gray-400' };
    const val = parseFloat(bmi);
    if (val < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (val < 25) return { category: 'Normal', color: 'text-green-600' };
    if (val < 30) return { category: 'Overweight', color: 'text-orange-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  // ✅ Dummy prediction + notes
  const prediction = 140;
  const doctorNotes = {
    recommendations: 'Continue current medication and diet.',
    specialInstructions: 'Monitor glucose before bedtime.',
    followUpDate: '2025-10-01',
  };

  // ✅ Example glucose data
  const glucoseData = [
    { time: '08:00', glucose: 110 },
    { time: '10:00', glucose: 150 },
    { time: '12:00', glucose: 130, predicted: true },
    { time: '14:00', glucose: 160 },
  ];

  const alertSettings = { lowThreshold: 70, highThreshold: 180 };
  const alerts = [
    { id: 1, type: 'hypo', message: 'Glucose dropped below 70 mg/dL' },
    { id: 2, type: 'hyper', message: 'Glucose exceeded 180 mg/dL' },
  ];

  const showBiomarkers = true;

  return (
    <div className="p-6 bg-muted">
      {showBiomarkers ? (
        <div className="space-y-6">
          {/* Biomarkers Tracking */}
          <div className="bg-background rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <Activity className="text-purple-500 mr-2" size={24} />
              <h2 className="text-xl font-semibold text-foreground">
                Biomarkers Tracking
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* HbA1c */}
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 className="font-medium text-red-800 mb-3">
                  HbA1c (Glycated Hemoglobin)
                </h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={biomarkers.hba1c}
                      onChange={e =>
                        handleBiomarkerChange('hba1c', e.target.value)
                      }
                      placeholder="7.5"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      %
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
                      Target: &lt;7% for most adults
                    </p>
                  )}
                </div>
              </div>

              {/* Blood Pressure */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-3">
                  Blood Pressure
                </h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={biomarkers.systolicBP}
                      onChange={e =>
                        handleBiomarkerChange('systolicBP', e.target.value)
                      }
                      placeholder="120"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm">/</span>
                    <input
                      type="number"
                      value={biomarkers.diastolicBP}
                      onChange={e =>
                        handleBiomarkerChange('diastolicBP', e.target.value)
                      }
                      placeholder="80"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      mmHg
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
                      Target: &lt;130/80 mmHg
                    </p>
                  )}
                </div>
              </div>

              {/* Weight & BMI */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-medium text-green-800 mb-3">
                  Weight & BMI
                </h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={biomarkers.weight}
                      onChange={e =>
                        handleBiomarkerChange('weight', e.target.value)
                      }
                      placeholder="70"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      kg
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={biomarkers.height}
                      onChange={e =>
                        handleBiomarkerChange('height', e.target.value)
                      }
                      placeholder="170"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      cm
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
                      <span className="font-medium">BMI: {biomarkers.bmi}</span>
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
                <h3 className="font-medium text-yellow-800 mb-3">
                  Cholesterol Profile
                </h3>
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
                      placeholder="Total"
                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                    <input
                      type="number"
                      value={biomarkers.hdlCholesterol}
                      onChange={e =>
                        handleBiomarkerChange('hdlCholesterol', e.target.value)
                      }
                      placeholder="HDL"
                      className="px-2 py-1 border border-gray-300 rounded text-xs"
                    />
                    <input
                      type="number"
                      value={biomarkers.ldlCholesterol}
                      onChange={e =>
                        handleBiomarkerChange('ldlCholesterol', e.target.value)
                      }
                      placeholder="LDL"
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
                      placeholder="Triglycerides"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      mg/dL
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
                    Targets: LDL &lt;100, HDL &gt;40♂/50♀, TG &lt;150
                  </p>
                </div>
              </div>

              {/* Kidney Function */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-medium text-purple-800 mb-3">
                  Kidney Function
                </h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.1"
                      value={biomarkers.creatinine}
                      onChange={e =>
                        handleBiomarkerChange('creatinine', e.target.value)
                      }
                      placeholder="1.0"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      mg/dL
                    </span>
                  </div>
                  <input
                    type="date"
                    value={biomarkers.creatinineDate}
                    onChange={e =>
                      handleBiomarkerChange('creatinineDate', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />

                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={biomarkers.microalbumin}
                      onChange={e =>
                        handleBiomarkerChange('microalbumin', e.target.value)
                      }
                      placeholder="Microalbumin"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <span className="flex items-center text-sm text-gray-600">
                      mg/g
                    </span>
                  </div>
                </div>
              </div>

              {/* Screening Exams */}
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h3 className="font-medium text-indigo-800 mb-3">
                  Screening Exams
                </h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Last Eye Exam
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
                      Last Foot Exam
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
                    Annual eye & foot exams recommended
                  </p>
                </div>
              </div>
            </div>

            {/* Biomarkers Summary */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium text-foreground mb-3">
                Quick Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-foreground">HbA1c</div>
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
                    {biomarkers.hba1c ? `${biomarkers.hba1c}%` : 'Not set'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-foreground">BP</div>
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
                      : 'Not set'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-foreground">BMI</div>
                  <div
                    className={`font-bold ${
                      biomarkers.bmi
                        ? getBMICategory(biomarkers.bmi).color
                        : 'text-gray-400'
                    }`}
                  >
                    {biomarkers.bmi || 'Not set'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-foreground">LDL</div>
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
                      : 'Not set'}
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
                AI Prediction Engine
              </h2>
            </div>

            {prediction && (
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Next 30-minute prediction:
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {prediction} mg/dL
                </p>
                <p className="text-xs text-foreground mt-1">
                  Based on time-series analysis + rule-based factors
                </p>
              </div>
            )}
          </div>

          {/* Doctor's Recommendations Display */}
          {(doctorNotes.recommendations || doctorNotes.specialInstructions) && (
            <div className="bg-background rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="text-blue-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-foreground">
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
                  Real-Time Blood Glucose
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
                  <div
                    className="w-3 h-3 bg-purple-500 rounded-full
 mr-2"
                  ></div>
                  AI predictions
                </span>
              </div>
            </div>

            {/* Alerts System */}
            <div className="bg-background rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Bell className="text-red-500 mr-2" size={24} />
                <h2 className="text-xl font-semibold text-foreground">
                  Alerts System
                </h2>
              </div>

              {alerts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
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
                  <p className="text-muted-foreground">Total Readings</p>
                  <p className="text-xl font-bold text-foreground">
                    {glucoseData.length}
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-muted-foreground">Data Points Today</p>
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
