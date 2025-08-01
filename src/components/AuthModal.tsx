import { useAuth } from "@/hooks/useAuth";
import React, { FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Chrome, Mail, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onSwitchMode: () => void;
}

const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Ocorreu um erro"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Ocorreu um erro"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Ocorreu um erro"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>
          <VisuallyHidden>
            {resetMode
              ? "Redefinir Senha"
              : mode === "signin"
              ? "Entrar"
              : "Criar Conta"}
          </VisuallyHidden>
        </DialogTitle>
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {resetMode
                ? "Redefinir Senha"
                : mode === "signin"
                ? "Bem-vindo de Volta"
                : "Criar Conta"}
            </CardTitle>
            <CardDescription>
              {resetMode
                ? "Introduza o seu email para redefinir a senha"
                : mode === "signin"
                ? "Entre para aceder ao seu histórico de conversas"
                : "Junte-se ao Moz Chat  para guardar as suas conversas"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Verifique o seu Email</h3>
                  <p className="text-muted-foreground">
                    Enviámos um link de redefinição de senha para {email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setResetMode(false);
                    setResetSent(false);
                    setEmail("");
                  }}
                >
                  Voltar para Entrar
                </Button>
              </div>
            ) : (
              <>
                <form
                  className="space-y-2"
                  onSubmit={resetMode ? handlePasswordReset : handleSubmit}
                >
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Digite o seu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  {!resetMode && (
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Senha
                      </label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Digite a sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="mt-1"
                      />
                    </div>
                  )}
                  {error && (
                    <Card className="border-destructive">
                      <CardContent className="pt-3">
                        <p className="text-sm text-destructive">{error}</p>
                      </CardContent>
                    </Card>
                  )}
                  <Button className="w-full" type="submit">
                    {loading
                      ? "A carregar..."
                      : resetMode
                      ? "Enviar link de redefinição"
                      : mode === "signin"
                      ? "Entrar"
                      : "Criar Conta"}
                  </Button>
                </form>
                {!resetMode && (
                  <>
                    <div className="relative mt-4">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Ou continue com
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={"outline"}
                      disabled={loading}
                      className="w-full mt-2"
                      onClick={handleGoogleSignIn}
                    >
                      <Chrome className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <div className="space-y-2 text-center text-sm">
                      {mode === "signin" && (
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setResetMode(true)}
                          className="h-auto p-0 mt-2"
                        >
                          Esqueceu a sua senha?
                        </Button>
                      )}
                      <div>
                        <span className="text-muted-foreground">
                          {mode === "signin"
                            ? "Não tem uma conta? "
                            : "Já tem uma conta? "}
                        </span>
                        <Button
                          type="button"
                          variant="link"
                          onClick={onSwitchMode}
                          className="h-auto p-0 mt-2"
                        >
                          {mode === "signin" ? "Criar Conta" : "Entrar"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
