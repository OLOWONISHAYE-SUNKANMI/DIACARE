import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { predictiveAnalyzer } from "@/utils/SimplifiedPredictiveAnalyzer";
import type { RiskAlert } from "@/utils/SimplifiedPredictiveAnalyzer";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "@/store/useThemeStore";

interface PredictiveAlertsProps {
  className?: string;
}

const PredictiveAlerts: React.FC<PredictiveAlertsProps> = ({ className = "" }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeStore();
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const newAlerts = predictiveAnalyzer.analyzeAndGenerateAlerts();
      setAlerts(newAlerts);
      setLoading(false);
    }, 1500);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return isDarkMode ? "bg-danger text-white" : "bg-danger-light text-white";
      case "high":
        return isDarkMode ? "bg-warning text-white" : "bg-warning-light text-white";
      case "medium":
        return isDarkMode ? "bg-accent text-accent-foreground" : "bg-yellow-400 text-black";
      case "low":
        return isDarkMode ? "bg-info text-white" : "bg-info-light text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "hypo_risk":
        return <TrendingDown className="w-5 h-5" />;
      case "hyper_risk":
        return <TrendingUp className="w-5 h-5" />;
      case "trend_warning":
        return <AlertTriangle className="w-5 h-5" />;
      case "medication_reminder":
        return <Pill className="w-5 h-5" />;
      case "pattern_anomaly":
        return <Target className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const handleMarkAsRead = (alertId: string) => {
    predictiveAnalyzer.markAlertAsRead(alertId);
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
  };

  const handleDismissAll = () => {
    alerts.forEach((alert) => predictiveAnalyzer.markAlertAsRead(alert.id));
    setAlerts([]);
  };

  if (loading) {
    return (
      <Card className={`bg-accent text-foreground ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="w-8 h-8 animate-pulse text-accent-foreground" />
            <div>
              <p className="text-lg font-bold text-foreground">
                {t("predictiveAlerts.aiAnalysis.inProgress")}
              </p>
              <p className="text-sm text-foreground/80">
                {t("predictiveAlerts.aiAnalysis.patternDetection")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeAlerts = alerts.filter((alert) => !alert.isRead);
  const stats = predictiveAnalyzer.getAlertStats();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <Card className={`bg-card text-foreground ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-6 h-6" />
              <span className="font-semibold">{t("Alerts.title")}</span>
            </div>
            {activeAlerts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismissAll}
                className="text-foreground hover:bg-foreground/20"
              >
                {t("predictiveAlerts.notifications.markAllRead")}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-extrabold">{stats.total}</div>
              <div className="text-sm opacity-90">Total</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-danger">{stats.critical + stats.high}</div>
              <div className="text-sm opacity-90">{t("Alerts.urgent")}</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-warning">{stats.medium}</div>
              <div className="text-sm opacity-90">{t("Alerts.monitor")}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {activeAlerts.length === 0 ? (
        <Card className="bg-success text-white">
          <CardContent className="p-6 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-success-foreground" />
            <h3 className="text-lg font-bold mb-2">{t("Alerts.good")}</h3>
            <p>{t("Alerts.message")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {activeAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 shadow-lg bg-card border-l-primary`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getSeverityColor(alert.severity)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-foreground">{alert.title}</h3>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-foreground/80">{alert.message}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="text-foreground/80 hover:text-foreground"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Alert className="mb-4 bg-info-light border-info">
                  <Clock className="w-4 h-4 text-info-foreground" />
                  <AlertDescription>
                    <strong>{t("predictiveAlerts.alerts.prediction")}:</strong>{" "}
                    {alert.prediction}
                    {alert.timeframe < 999 && (
                      <span className="ml-2 text-sm">
                        ({t("predictiveAlerts.alerts.inApproxMinutes", { minutes: alert.timeframe })})
                      </span>
                    )}
                  </AlertDescription>
                </Alert>

                {/* Recommended actions */}
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center text-foreground">
                    <Target className="w-4 h-4 mr-2 text-accent-foreground" />
                    {t("predictiveAlerts.recommendations.actions")}
                  </h4>
                  <ul className="space-y-1">
                    {alert.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-foreground/80">
                        <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 bg-accent" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Confidence and timestamp */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-foreground/20 text-xs text-foreground/80">
                  <div className="flex items-center space-x-4">
                    <span>{t("predictiveAlerts.predictive.confidence")}: {alert.confidence}%</span>
                    <span>•</span>
                    <span>{alert.createdAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <Badge variant="outline" className="text-xs border-foreground text-foreground">
                    {t("predictiveAlerts.predictive.label")}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* AI Analysis Summary */}
      <Card className="bg-accent text-foreground">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-accent-foreground" />
            <div>
              <h4 className="font-bold text-foreground">{t("analyze.title")}</h4>
              <p className="text-sm text-foreground/80">{t("analyze.message")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveAlerts;
