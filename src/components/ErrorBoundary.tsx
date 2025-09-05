import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Wrap the actual UI in a functional component to use hooks
      const ErrorContent = () => {
        const { t } = useTranslation();

        return (
          <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-destructive shadow-lg">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle className="text-destructive text-xl">
                  {t('errorBoundary.error_occurred')}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground text-sm">
                  {t('errorBoundary.unexpected_error_message')}
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <div className="bg-muted p-3 rounded text-xs text-left">
                    <p className="font-mono text-destructive mb-2">
                      {this.state.error.message}
                    </p>
                    {this.state.errorInfo && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-muted-foreground">
                          Stack trace
                        </summary>
                        <pre className="whitespace-pre-wrap text-xs mt-2">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={this.handleReload}
                    className="flex-1 bg-medical-teal hover:bg-medical-teal/90"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t('errorBoundary.button_restart')}
                  </Button>
                  <Button
                    onClick={this.handleGoHome}
                    variant="outline"
                    className="flex-1"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    {t('errorBoundary.button_home')}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground border-t pt-4">
                  {t('errorBoundary.footer_text')}
                </p>
              </CardContent>
            </Card>
          </div>
        );
      };

      return <ErrorContent />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
