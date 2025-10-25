import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import OceanDepthBackground from '@/components/OceanDepthBackground';
import { useLocalization } from '@/hooks/useLocalization';

const Auth = () => {
  const { lang } = useParams();
  const { t } = useLocalization();
  
  const emailSchema = z.string().email(t('auth.validation.invalidEmail')).max(255);
  const passwordSchema = z.string().min(6, t('auth.validation.passwordMinLength')).max(100);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signUp, signIn, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${lang}/`);
    }
  }, [user, navigate, lang]);

  const validateInputs = () => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: t('auth.toasts.validationError'),
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
      return false;
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    
    setIsLoading(true);
    const { error } = await signUp(email, password);
    setIsLoading(false);

    if (error) {
      toast({
        title: t('auth.toasts.signUpFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('auth.toasts.success'),
        description: t('auth.toasts.checkEmail'),
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);

    if (error) {
      toast({
        title: t('auth.toasts.signInFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('auth.toasts.welcomeBack'),
        description: t('auth.toasts.signedInSuccessfully'),
      });
      navigate(`/${lang}/`);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: t('auth.toasts.validationError'),
        description: t('auth.validation.invalidEmail'),
        variant: 'destructive',
      });
      return;
    }

    try {
      emailSchema.parse(email);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: t('auth.toasts.validationError'),
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
      return;
    }

    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);

    if (error) {
      toast({
        title: t('auth.toasts.resetPasswordFailed'),
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: t('auth.toasts.resetPasswordSent'),
        description: t('auth.toasts.resetPasswordSuccess'),
      });
      setShowForgotPassword(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <OceanDepthBackground />
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md bg-card/90 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl text-center">{t('auth.title')}</CardTitle>
            <CardDescription className="text-center">
              {t('auth.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">{t('auth.tabs.signIn')}</TabsTrigger>
                <TabsTrigger value="signup">{t('auth.tabs.signUp')}</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">{t('auth.form.email')}</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder={t('auth.form.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">{t('auth.form.password')}</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder={t('auth.form.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    variant="ocean"
                    disabled={isLoading}
                  >
                    {isLoading ? t('auth.buttons.signingIn') : t('auth.buttons.signIn')}
                  </Button>
                  
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-muted-foreground hover:text-foreground p-0 h-auto"
                    >
                      {t('auth.forgotPassword.title')}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('auth.form.email')}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder={t('auth.form.emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('auth.form.password')}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder={t('auth.form.passwordPlaceholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    variant="ocean"
                    disabled={isLoading}
                  >
                    {isLoading ? t('auth.buttons.creatingAccount') : t('auth.buttons.signUp')}
                  </Button>
                </form>
              </TabsContent>

            </Tabs>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate(`/${lang}/`)}
                className="text-muted-foreground hover:text-foreground"
              >
                {t('auth.buttons.continueWithoutAccount')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowForgotPassword(false);
            }
          }}
        >
          <div className="bg-background rounded-lg shadow-lg max-w-md w-full p-6 space-y-6 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 h-8 w-8 p-0"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
            
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{t('auth.forgotPassword.title')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('auth.forgotPassword.description')}
              </p>
            </div>
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="modal-forgot-email">{t('auth.forgotPassword.emailLabel')}</Label>
                <Input
                  id="modal-forgot-email"
                  type="email"
                  placeholder={t('auth.forgotPassword.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {t('auth.forgotPassword.backToSignIn')}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  variant="ocean"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.sendResetLink')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;