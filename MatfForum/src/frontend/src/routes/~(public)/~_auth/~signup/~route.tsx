import { createFileRoute, Link } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppForm } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSignUpEmailMutation } from "./api/signup";

// Simple labels object for signup form UI
const signupLabels = {
  title: "Create Account",
  description: "Sign up to get started with MatForum.",
  firstName: "First Name",
  lastName: "Last Name",
  username: "Username",
  email: "Email",
  password: "Password",
  phoneNumber: "Phone Number",
  submit: "Sign Up",
  alreadyHaveAccount: "Already have an account?",
  login: "Sign In",
};

export const Route = createFileRoute("/(public)/_auth/signup")({
  component: SignUpComponent,
});

function SignUpComponent() {
  const navigate = Route.useNavigate();
  const signUpEmailMutation = useSignUpEmailMutation();

  const form = useAppForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
    onSubmit: async ({ value }) => {
      await signUpEmailMutation.mutateAsync(value, {
        onSuccess: () => {
          void navigate({ to: "/login" });
        },
      });
    },
  });

  return (
    <div className="w-full">
      <Card className="mx-auto mt-12 max-w-lg">
        <CardHeader>
          <CardTitle>{signupLabels.title}</CardTitle>
          <CardDescription>{signupLabels.description}</CardDescription>
        </CardHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void form.handleSubmit();
          }}
        >
          <CardContent>
            <div className="grid gap-4">
              <form.AppField name="firstName">
                {(field) => (
                  <field.FieldContainer>
                    <field.FieldLabel>{signupLabels.firstName}</field.FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      placeholder={`Enter your ${signupLabels.firstName.toLowerCase()}`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <field.FieldMessage />
                  </field.FieldContainer>
                )}
              </form.AppField>

              <form.AppField name="lastName">
                {(field) => (
                  <field.FieldContainer>
                    <field.FieldLabel>{signupLabels.lastName}</field.FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      placeholder={`Enter your ${signupLabels.lastName.toLowerCase()}`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <field.FieldMessage />
                  </field.FieldContainer>
                )}
              </form.AppField>

              <form.AppField name="username">
                {(field) => (
                  <field.FieldContainer>
                    <field.FieldLabel>{signupLabels.username}</field.FieldLabel>
                    <Input
                      type="text"
                      id={field.name}
                      placeholder={`Enter your ${signupLabels.username.toLowerCase()}`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <field.FieldMessage />
                  </field.FieldContainer>
                )}
              </form.AppField>

              <form.AppField name="email">
                {(field) => (
                  <field.FieldContainer>
                    <field.FieldLabel>{signupLabels.email}</field.FieldLabel>
                    <Input
                      type="email"
                      id={field.name}
                      placeholder={`Enter your ${signupLabels.email.toLowerCase()}`}
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
                    <field.FieldLabel>{signupLabels.password}</field.FieldLabel>
                    <Input
                      type="password"
                      id={field.name}
                      placeholder={`Enter your ${signupLabels.password.toLowerCase()}`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <field.FieldMessage />
                  </field.FieldContainer>
                )}
              </form.AppField>

              <form.AppField name="phoneNumber">
                {(field) => (
                  <field.FieldContainer>
                    <field.FieldLabel>{signupLabels.phoneNumber}</field.FieldLabel>
                    <Input
                      type="tel"
                      id={field.name}
                      placeholder={`Enter your ${signupLabels.phoneNumber.toLowerCase()}`}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <field.FieldMessage />
                  </field.FieldContainer>
                )}
              </form.AppField>

              <form.AppForm>
                <form.FormSubmit>{signupLabels.submit}</form.FormSubmit>
              </form.AppForm>
            </div>
          </CardContent>
        </form>
        <CardFooter className="flex flex-col justify-center">
          {signupLabels.alreadyHaveAccount}
          <Link to="/login">{signupLabels.login}</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
