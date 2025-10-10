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
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSignInEmailMutation, zLoginSchema } from "./api/login-email";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

// Simple labels object for form UI
const formLabels = {
  title: "Log in",
  description: "Sign in to continue your journey on MatForum.",
  username: "Username",
  password: "Password",
  rememberMe: "Remember me",
  submit: "Log in",
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
  const [showPassword, setShowPassword] = useState(false);

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
      try {
        await signInEmailMutation.mutateAsync(value, {
          onSuccess: () => {
            void navigate({ to: search.redirect ?? "/" });
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
              {/* Dropdown Menu */}
              <div className="dropdown-container">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex items-center gap-1 font-medium">
                      <span className="text-sm">More</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/signup" className="flex cursor-pointer items-center">
                        <span>Sign up</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/questions" className="flex cursor-pointer items-center">
                        <span>Browse Questions</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
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
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">?</span>
                    </div>
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
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-sm font-semibold">✓</span>
                    </div>
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
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-yellow-600 text-sm font-semibold">★</span>
                    </div>
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

        {/* Right Side - Login Form */}
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
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <CardTitle className="text-3xl font-bold text-gray-800">{formLabels.title}</CardTitle>
                <CardDescription className="text-gray-600 text-lg">{formLabels.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                  className="space-y-4"
                >
                  <form.AppField name="username">
                    {(field) => (
                      <field.FieldContainer>
                        <field.FieldLabel className="text-sm font-medium text-gray-700">{formLabels.username}</field.FieldLabel>
                        <Input
                          type="text"
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

                  <form.AppField name="password">
                    {(field) => (
                      <field.FieldContainer>
                        <field.FieldLabel className="text-sm font-medium text-gray-700">{formLabels.password}</field.FieldLabel>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            id={field.name}
                            placeholder="Enter your password"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </button>
                        </div>
                        <field.FieldMessage />
                      </field.FieldContainer>
                    )}
                  </form.AppField>

                  <form.AppField name="rememberMe">
                    {(field) => (
                      <field.FieldContainer className="flex flex-row items-center gap-2">
                        <Checkbox
                          id={field.name}
                          checked={field.state.value}
                          onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
                          className="border-gray-300"
                        />
                        <field.FieldLabel className="text-sm text-gray-700">{formLabels.rememberMe}</field.FieldLabel>
                        <field.FieldMessage />
                      </field.FieldContainer>
                    )}
                  </form.AppField>

                  <form.AppForm>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                      disabled={signInEmailMutation.isPending}
                    >
                      {signInEmailMutation.isPending ? "Signing in..." : formLabels.submit}
                    </Button>
                  </form.AppForm>
                </form>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4 pt-6">
                <div className="text-center text-sm text-gray-600">
                  {formLabels.dontHaveAccount}{" "}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                    {formLabels.signUp}
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