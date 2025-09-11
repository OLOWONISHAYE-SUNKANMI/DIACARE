import React from 'react';
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  Shield,
  Pill,
  Target,
  Brain,
  X,
  CheckCircle,
  Users,
  Zap,
  Activity,
  Calendar,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useSimplifiedPredictiveAlerts } from '@/hooks/useSimplifiedPredictiveAlerts';
import { useTranslation } from 'react-i18next';

interface SimplifiedPredictiveAlertsProps {
  className?: string;
}

const SimplifiedPredictiveAlerts: React.FC<SimplifiedPredictiveAlertsProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();
  const {
    alerts,
    loading,
    patientProfile,
    triggerAnalysis,
    markAlertAsRead,
    dismissAllAlerts,
    triggerEmergencyAlert,
    getFamilyNotifications,
  } = useSimplifiedPredictiveAlerts();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 text-white border-red-600';
      case 'high':
        return 'bg-orange-500 text-white border-orange-600';
      case 'medium':
        return 'bg-yellow-500 text-black border-yellow-600';
      case 'low':
        return 'bg-blue-500 text-white border-blue-600';
      default:
        return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'hypo_risk':
        return <TrendingDown className="w-5 h-5" />;
      case 'hyper_risk':
        return <TrendingUp className="w-5 h-5" />;
      case 'trend_warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'medication_reminder':
        return <Pill className="w-5 h-5" />;
      case 'pattern_anomaly':
        return <Target className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getRiskLevel = (confidence: number) => {
    if (confidence >= 90)
      return {
        level: t('simplifiedPredictiveAlerts.riskLevel.veryHigh'),
        color: 'text-red-600',
      };
    if (confidence >= 75)
      return {
        level: t('simplifiedPredictiveAlerts.riskLevel.high'),
        color: 'text-orange-600',
      };
    if (confidence >= 60)
      return {
        level: t('simplifiedPredictiveAlerts.riskLevel.moderate'),
        color: 'text-yellow-600',
      };
    return {
      level: t('simplifiedPredictiveAlerts.riskLevel.low'),
      color: 'text-blue-600',
    };
  };

  const familyNotifications = getFamilyNotifications();

  const lastNotificationTime = familyNotifications[0]?.timestamp
    ? new Date(familyNotifications[0].timestamp).toLocaleTimeString('fr-FR')
    : t('familyCard.noNotifications');

  if (loading) {
    return (
      <Card
        className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 ${className}`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="w-8 h-8 text-blue-500 animate-pulse" />
            <div>
              <p className="text-lg font-semibold text-blue-700">
                🤖 {t('simplifiedPredictiveAlerts.advancedAI.title')}
              </p>
              <p className="text-sm text-blue-600">
                {t('simplifiedPredictiveAlerts.advancedAI.subtitle')}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-blue-600">
              <span>
                {t(
                  'simplifiedPredictiveAlerts.advancedAI.glycemicPatternAnalysis'
                )}
              </span>
              <span>85%</span>
            </div>
            <Progress value={85} className="h-1" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeAlerts = alerts.filter(alert => !alert.isRead);
  const criticalAlerts = activeAlerts.filter(
    a => a.severity === 'critical'
  ).length;
  const highAlerts = activeAlerts.filter(a => a.severity === 'high').length;
  const mediumAlerts = activeAlerts.filter(a => a.severity === 'medium').length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* AI Header with Patient Profile */}
      <Card className="bg-gradient-to-r from-purple-500 via-blue-500 to-teal-500 text-white border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <span className="text-lg font-bold">
                  {t('simplifiedPredictiveAlerts.multiFactorAI.title')}
                </span>
                <div className="flex items-center space-x-2 text-sm opacity-90">
                  <Zap className="w-4 h-4" />
                  <span>
                    {t('simplifiedPredictiveAlerts.multiFactorAI.features')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={triggerAnalysis}
                className="text-white hover:bg-white/20"
              >
                <Brain className="w-4 h-4 mr-1" />
                {t('simplifiedPredictiveAlerts.multiFactorAI.analyze')}
              </Button>
              {activeAlerts.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={dismissAllAlerts}
                  className="text-white hover:bg-white/20"
                >
                  {t('simplifiedPredictiveAlerts.multiFactorAI.dismissAll')}
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{activeAlerts.length}</div>
              <div className="text-xs opacity-90">
                {t('simplifiedPredictiveAlerts.multiFactorAI.alerts')}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-200">
                {criticalAlerts}
              </div>
              <div className="text-xs opacity-90">
                {t('simplifiedPredictiveAlerts.multiFactorAI.critical')}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-200">
                {highAlerts}
              </div>
              <div className="text-xs opacity-90">
                {t('simplifiedPredictiveAlerts.multiFactorAI.high')}
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-200">
                {mediumAlerts}
              </div>
              <div className="text-xs opacity-90">
                {t('simplifiedPredictiveAlerts.multiFactorAI.medium')}
              </div>
            </div>
          </div>

          {/* Patient Profile Info */}
          <div className="mt-4 pt-3 border-t border-white/20">
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div>
                <div className="opacity-75">
                  {t('simplifiedPredictiveAlerts.multiFactorAI.age')}
                </div>
                <div className="font-semibold">{patientProfile.age} ans</div>
              </div>
              <div>
                <div className="opacity-75">
                  {t('simplifiedPredictiveAlerts.multiFactorAI.type')}
                </div>
                <div className="font-semibold">
                  DT{patientProfile.diabetesType}
                </div>
              </div>
              <div>
                <div className="opacity-75">
                  {t('simplifiedPredictiveAlerts.multiFactorAI.ratio')}
                </div>
                <div className="font-semibold">
                  1/{patientProfile.carbRatio}
                </div>
              </div>
              <div>
                <div className="opacity-75">
                  {t('simplifiedPredictiveAlerts.multiFactorAI.target')}
                </div>
                <div className="font-semibold">
                  {patientProfile.targetGlucose}mg/dL
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Button */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <h4 className="font-semibold text-red-700">
                  {t('simplifiedPredictiveAlerts.emergencyCard.title')}
                </h4>
                <p className="text-sm text-red-600">
                  {t('simplifiedPredictiveAlerts.emergencyCard.subtitle')}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => triggerEmergencyAlert('medical_emergency')}
              >
                <Users className="w-4 h-4 mr-1" />
                {t('simplifiedPredictiveAlerts.emergencyCard.alertFamily')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Family Notifications Status */}
      {familyNotifications.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-700">
                  {t('simplifiedPredictiveAlerts.familyCard.title', {
                    count: familyNotifications.length,
                  })}
                </h4>
                <p className="text-sm text-green-600">
                  {t('simplifiedPredictiveAlerts.familyCard.lastNotification', {
                    time: lastNotificationTime,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Alerts */}
      {activeAlerts.length === 0 ? (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              {t('simplifiedPredictiveAlerts.iaCard.title')}
            </h3>
            <p className="text-green-600 mb-3">{t('iaCard.description')}</p>
            <div className="grid grid-cols-3 gap-4 text-sm text-green-600">
              <div className="flex items-center justify-center space-x-1">
                <Activity className="w-4 h-4" />
                <span>{t('simplifiedPredictiveAlerts.iaCard.patternsOk')}</span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <Target className="w-4 h-4" />
                <span>
                  {t('simplifiedPredictiveAlerts.iaCard.stablePredictions')}
                </span>
              </div>
              <div className="flex items-center justify-center space-x-1">
                <Users className="w-4 h-4" />
                <span>
                  {t('simplifiedPredictiveAlerts.iaCard.familyNotified')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeAlerts.map(alert => {
            const riskLevel = getRiskLevel(alert.confidence);

            return (
              <Card
                key={alert.id}
                className={`shadow-lg border-l-4 ${
                  alert.severity === 'critical'
                    ? 'border-l-red-500 bg-red-50'
                    : alert.severity === 'high'
                      ? 'border-l-orange-500 bg-orange-50'
                      : alert.severity === 'medium'
                        ? 'border-l-yellow-500 bg-yellow-50'
                        : 'border-l-blue-500 bg-blue-50'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div
                        className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}
                      >
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {alert.title}
                          </h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-gray-700 text-sm mb-2">
                          {alert.message}
                        </p>

                        {/* Risk Level and Confidence */}
                        <div className="flex items-center space-x-4 mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {t('simplifiedPredictiveAlerts.alert.riskLevel')}
                            </span>
                            <span
                              className={`text-xs font-semibold ${riskLevel.color}`}
                            >
                              {riskLevel.level}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {t('simplifiedPredictiveAlerts.alert.confidence')}
                            </span>
                            <span className="text-xs font-semibold">
                              {alert.confidence}%
                            </span>
                          </div>
                        </div>

                        {/* Confidence Progress */}
                        <div className="mb-3">
                          <Progress value={alert.confidence} className="h-2" />
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markAlertAsRead(alert.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Prediction Alert */}
                  <Alert
                    className={`mb-4 ${
                      alert.severity === 'critical'
                        ? 'bg-red-100 border-red-300'
                        : alert.severity === 'high'
                          ? 'bg-orange-100 border-orange-300'
                          : 'bg-blue-100 border-blue-300'
                    }`}
                  >
                    <Clock
                      className={`w-4 h-4 ${
                        alert.severity === 'critical'
                          ? 'text-red-600'
                          : alert.severity === 'high'
                            ? 'text-orange-600'
                            : 'text-blue-600'
                      }`}
                    />
                    <AlertDescription
                      className={`${
                        alert.severity === 'critical'
                          ? 'text-red-800'
                          : alert.severity === 'high'
                            ? 'text-orange-800'
                            : 'text-blue-800'
                      }`}
                    >
                      <strong>
                        {t('simplifiedPredictiveAlerts.alert.iaPrediction')}
                      </strong>{' '}
                      {alert.prediction}
                      {alert.timeframe < 999 && (
                        <span className="ml-2 font-semibold">
                          (
                          {t('simplifiedPredictiveAlerts.alert.inApprox', {
                            minutes: alert.timeframe,
                          })}
                          )
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>

                  {/* Recommended Actions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-green-600" />
                      {t('simplifiedPredictiveAlerts.ai.recommendedActions')}
                    </h4>
                    <div className="grid gap-2">
                      {alert.recommendedActions.map((action, index) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-2 rounded-lg bg-white border"
                        >
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold text-green-600">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-sm text-gray-700">
                            {action}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Footer with Family Notification Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {alert.createdAt.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Brain className="w-3 h-3" />
                        return{' '}
                        <span>
                          {t('simplifiedPredictiveAlerts.ai.version', {
                            version: 'v2.0',
                          })}
                        </span>
                        ;
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="text-xs bg-green-50 text-green-700 border-green-200"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        {t('simplifiedPredictiveAlerts.badge.familyNotified')}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* AI Analysis Summary */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full">
              <Brain className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-indigo-700">
                {t('simplifiedPredictiveAlerts.predictiveSystem.active')}
              </h4>
              <p className="text-sm text-indigo-600">
                {t('simplifiedPredictiveAlerts.predictiveSystem.description')}
              </p>
            </div>
            <div className="text-right text-xs text-indigo-500">
              <div>
                {t(
                  'simplifiedPredictiveAlerts.predictiveSystem.nextAnalysisLabel'
                )}
              </div>
              <div className="font-semibold">
                {t(
                  'simplifiedPredictiveAlerts.predictiveSystem.nextAnalysisTime',
                  { time: '5 min' }
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplifiedPredictiveAlerts;
