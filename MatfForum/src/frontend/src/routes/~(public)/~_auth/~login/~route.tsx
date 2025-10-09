import { createFileRoute, Link } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSignInEmailMutation, zLoginSchema } from "./api/login-email";

// Simple labels object for form UI
const formLabels = {
  title: "Welcome back",
  description: "Sign in to your account to continue.",
  username: "Username",
  password: "Password",
  rememberMe: "Remember me",
  submit: "Sign In",
  dontHaveAccount: "Don't have an account?",
  signUp: "Sign up",
};

const zLoginPageSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/(public)/_auth/login")({
  validateSearch: zodValidator(zLoginPageSearchSchema),
  loaderDeps: ({ search }) => ({ ...search }),
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch();
  const signInEmailMutation = useSignInEmailMutation();

  const form = useAppForm({
    validators: {
      onChange: zLoginSchema(),
    },
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
    onSubmit: async ({ value }) => {
      await signInEmailMutation.mutateAsync(value, {
        onSuccess: () => {
          void navigate({ to: search.redirect ?? "/" });
        },
      });
    },
  });


  return (
    <div className="w-full">
      <Card className="mx-auto mt-12 max-w-lg">
        <CardHeader>
          <CardTitle>{formLabels.title}</CardTitle>
          <CardDescription>{formLabels.description}</CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <CardContent>
            <div className="grid gap-4">
              <form.AppField name="username">
                {(field) => (
                  <field.FieldContainer>
                    <field.FieldLabel>{formLabels.username}</field.FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      placeholder={`Enter your ${formLabels.username.toLowerCase()}`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <field.FieldMessage />
                  </field.FieldContainer>
                )}
              </form.AppField>
              <form.AppField name="password">
                {(field) => (
                  <field.FieldContainer>
                    <field.FieldLabel>{formLabels.password}</field.FieldLabel>
                    <Input
                      type="password"
                      id={field.name}
                      placeholder={`Enter your ${formLabels.password.toLowerCase()}`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <field.FieldMessage />
                  </field.FieldContainer>
                )}
              </form.AppField>
              {/* <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary underline">
                  {"Forgot password"}
                </Link>
              </div> */}
              <form.AppField name="rememberMe">
                {(field) => (
                  <field.FieldContainer className="flex flex-row items-end gap-2">
                    <field.FieldLabel>{formLabels.rememberMe}</field.FieldLabel>
                    <Checkbox
                      id={field.name}
                      checked={field.state.value}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onCheckedChange={(checked: any) => field.handleChange(Boolean(checked))}
                    />
                    <field.FieldMessage />
                  </field.FieldContainer>
                )}
              </form.AppField>
              <form.AppForm>
                <form.FormSubmit>{formLabels.submit}</form.FormSubmit>
              </form.AppForm>
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col justify-center">
          {/* <div className="mb-4 grid w-full gap-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  {t("form.orContinueWith")}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="mt-3 bg-[#5865F2] text-white hover:bg-[#4752C4]"
              onClick={() => void socialSignIn("discord")}
            >
              {t("form.discord")}
            </Button>
          </div> */}
          {formLabels.dontHaveAccount}
          <Link to="/signup">{formLabels.signUp}</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
