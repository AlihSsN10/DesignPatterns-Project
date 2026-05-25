import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "@/schemas/loginSchema";
import { useApp } from "@/hooks/useApp";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, logout } = useApp();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values) {
    setLoading(true);
    const result = await login(values.email, values.password);
    
    if (result.success) {
      if (result.role === "ADMIN") {
        toast.success("Admin Authentication Successful");
        navigate("/dashboard");
      } else {
        // Not an admin!
        logout(); // Immediately kick them out
        toast.error("ACCESS DENIED: Master Admin Privileges Required", { duration: 4000 });
      }
    } else {
      toast.error(result.message || "Invalid email or password");
    }
    setLoading(false);
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4 bg-gray-50">
      <Card className="w-full max-w-sm shadow-xl border-red-100">
        <CardHeader className="text-center bg-red-50 rounded-t-xl border-b border-red-100">
          <ShieldAlert className="h-10 w-10 text-red-600 mx-auto mb-2" />
          <CardTitle className="text-2xl font-black text-red-900 tracking-tight">Admin Portal</CardTitle>
          <CardDescription className="text-red-700 font-medium">Restricted Access Only</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Master Email</FormLabel>
                  <FormControl><Input placeholder="admin@domain.com" {...field} className="border-gray-300 focus-visible:ring-red-500" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Secret Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} className="border-gray-300 focus-visible:ring-red-500" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <Button type="submit" disabled={loading} className="w-full bg-red-700 hover:bg-red-800 text-white font-bold tracking-wide">
                {loading ? "Authenticating..." : "AUTHORIZE"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
