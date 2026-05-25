import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/schemas/authSchema";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/hooks/useApp";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function SignUp() {
  const navigate    = useNavigate();
  const { register } = useApp();

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "", confirmPassword: "", role: "CUSTOMER" },
  });

  function onSubmit(values) {
    const ok = register(values);
    if (ok) navigate("/");
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Card className="w-full max-w-md shadow-lg border-teal-100">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-teal-800">Create an Account</CardTitle>
          <CardDescription>Register now to book event tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Enter your name" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="example@gmail.com" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="01xxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="role" render={({ field }) => (
                <FormItem>
                  <FormLabel>I want to...</FormLabel>
                  <FormControl>
                    <select {...field} className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500">
                      <option value="CUSTOMER">Attend Events</option>
                      <option value="EVENT_CREATOR">Organize Events</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem><FormLabel>Confirm Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem>
              )} />

              <Button type="submit" className="w-full bg-teal-800 hover:bg-teal-700 mt-2">Register</Button>
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button type="button" onClick={() => navigate("/login")} className="text-teal-700 font-bold hover:underline">Login</button>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}