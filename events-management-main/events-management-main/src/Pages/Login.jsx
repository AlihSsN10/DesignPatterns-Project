import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "@/schemas/loginSchema";
import { useApp } from "@/hooks/useApp";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function Login() {
  const navigate  = useNavigate();
  const { login } = useApp();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values) {
    const ok = login(values.email, values.password);
    if (ok) navigate("/");
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Card className="w-full max-w-sm shadow-lg border-teal-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-teal-800">Login</CardTitle>
          <CardDescription>Welcome to EM-Booking</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input placeholder="example@gmail.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" className="w-full bg-teal-800 hover:bg-teal-700">Login</Button>

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button type="button" onClick={() => navigate("/signup")} className="text-teal-700 font-bold hover:underline">
                  Sign Up
                </button>
              </p>

              {/* Test credentials hint */}
              <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 space-y-1">
                <p className="font-semibold text-gray-500">Test accounts:</p>
                <p>Organizer: <span className="font-mono">org@events.com</span> / password123</p>
                <p>Attendee: <span className="font-mono">user@events.com</span> / password123</p>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}