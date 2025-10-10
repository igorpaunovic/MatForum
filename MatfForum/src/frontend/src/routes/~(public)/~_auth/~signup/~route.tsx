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
import { Button } from "@/components/ui/button";

import { useSignUpEmailMutation, zSignUpSchema } from "./api/signup";
import { MessageSquare, BookOpen, Trophy } from "lucide-react";

// Simple labels object for signup form UI
const signupLabels = {
  title: "Join MatForum!",
  description: "Create your account and start asking questions.",
  firstName: "First Name",
  lastName: "Last Name",
  username: "Username",
  email: "Email",
  password: "Password",
  phoneNumber: "Phone Number",
  submit: "Sign up",
  alreadyHaveAccount: "Already have an account?",
  login: "Log in",
};

export const Route = createFileRoute("/(public)/_auth/signup")({
  component: SignUpComponent,
});

function SignUpComponent() {
  const navigate = Route.useNavigate();
  const signUpEmailMutation = useSignUpEmailMutation();

  const form = useAppForm({
    validators: {
      onChange: zSignUpSchema(),
    },
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await signUpEmailMutation.mutateAsync(value, {
          onSuccess: () => {
            void navigate({ to: "/" });
          },
        });
      } catch (error) {
        // Error is already handled by the mutation's onError handler
        // This prevents unhandled promise rejection
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-800">MatForum</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Home
              </Link>
              <Link to="/questions" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Questions
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-white to-blue-50 items-center justify-center p-12">
          <div className="max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-white font-bold text-3xl">M</span>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-3">MatForum</h1>
              <p className="text-gray-600 text-lg">Your community for mathematics, programming, and academic discussions</p>
            </div>
            
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Ask Questions</h3>
                  <p className="text-gray-600">Get unstuck - ask clear, specific questions!</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Save Knowledge</h3>
                  <p className="text-gray-600">Bookmark your favorite posts, tags and filters</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Build Reputation</h3>
                  <p className="text-gray-600">Answer questions and earn reputation points</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white font-bold text-2xl">M</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">MatForum</h1>
            </div>

            <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-3xl font-bold text-gray-800">{signupLabels.title}</CardTitle>
                <CardDescription className="text-gray-600 text-lg">{signupLabels.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <form.AppField name="firstName">
                      {(field) => (
                        <field.FieldContainer>
                          <field.FieldLabel className="text-sm font-medium text-gray-700">{signupLabels.firstName}</field.FieldLabel>
                          <Input
                            id={field.name}
                            placeholder="Enter your first name"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <field.FieldMessage />
                        </field.FieldContainer>
                      )}
                    </form.AppField>

                    <form.AppField name="lastName">
                      {(field) => (
                        <field.FieldContainer>
                          <field.FieldLabel className="text-sm font-medium text-gray-700">{signupLabels.lastName}</field.FieldLabel>
                          <Input
                            id={field.name}
                            placeholder="Enter your last name"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                          <field.FieldMessage />
                        </field.FieldContainer>
                      )}
                    </form.AppField>
                  </div>

                  <form.AppField name="username">
                    {(field) => (
                      <field.FieldContainer>
                        <field.FieldLabel className="text-sm font-medium text-gray-700">{signupLabels.username}</field.FieldLabel>
                        <Input
                          id={field.name}
                          placeholder="Enter your username"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <field.FieldMessage />
                      </field.FieldContainer>
                    )}
                  </form.AppField>

                  <form.AppField name="email">
                    {(field) => (
                      <field.FieldContainer>
                        <field.FieldLabel className="text-sm font-medium text-gray-700">{signupLabels.email}</field.FieldLabel>
                        <Input
                          type="email"
                          id={field.name}
                          placeholder="Enter your email"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <field.FieldMessage />
                      </field.FieldContainer>
                    )}
                  </form.AppField>

                  <form.AppField name="password">
                    {(field) => (
                      <field.FieldContainer>
                        <field.FieldLabel className="text-sm font-medium text-gray-700">{signupLabels.password}</field.FieldLabel>
                        <Input
                          type="password"
                          id={field.name}
                          placeholder="Enter your password"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <field.FieldMessage />
                      </field.FieldContainer>
                    )}
                  </form.AppField>

                  <form.AppField name="phoneNumber">
                    {(field) => (
                      <field.FieldContainer>
                        <field.FieldLabel className="text-sm font-medium text-gray-700">{signupLabels.phoneNumber}</field.FieldLabel>
                        <Input
                          type="tel"
                          id={field.name}
                          placeholder="Enter your phone number"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <field.FieldMessage />
                      </field.FieldContainer>
                    )}
                  </form.AppField>

                  <form.AppForm>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                      disabled={signUpEmailMutation.isPending}
                    >
                      {signUpEmailMutation.isPending ? "Creating account..." : signupLabels.submit}
                    </Button>
                  </form.AppForm>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-6">
                <div className="text-center text-sm text-gray-600">
                  By clicking "Sign up", you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-800">terms of service</a>{" "}
                  and acknowledge you have read our{" "}
                  <a href="#" className="text-blue-600 hover:text-blue-800">privacy policy</a>.
                </div>
                
                <div className="text-center text-sm text-gray-600">
                  {signupLabels.alreadyHaveAccount}{" "}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                    {signupLabels.login}
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}