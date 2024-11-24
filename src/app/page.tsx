import React from "react";
import {
  ArrowRight,
  MessageCircle,
  Users,
  BarChart3,
  Shield,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">ChatBox</span>
          </div>
          <Link
            href="/login"
            className={`${buttonVariants({
              variant: "default",
            })} flex items-center space-x-2`}
          >
            <span>Iniciar Sesión</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-12">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Gestiona las <span className="text-primary">Interacciones</span>
            de tu Chatbot de manera{" "}
            <span className="text-primary">Sencilla</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            ChatBox es una herramienta poderosa para gestionar las interacciones
            de tu chatbot. Con ChatBox, puedes gestionar fácilmente las
            interacciones de tu chatbot, incluyendo el envío y recepción de
            mensajes.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/login"
              className={`${buttonVariants({
                variant: "default",
              })} flex items-center space-x-2`}
            >
              <span>Comenzar</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Cuadrícula de Características */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <Card className="backdrop-blur-lg">
            <CardHeader>
              <div className="bg-primary p-3 rounded-lg w-fit">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Gestión de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Administra perfiles de usuarios, roles y permisos.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg">
            <CardHeader>
              <div className="bg-primary p-3 rounded-lg w-fit">
                <BarChart3 className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Analíticas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Obtén información sobre el comportamiento, compromiso y
                rendimiento de los usuarios.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-lg">
            <CardHeader>
              <div className="bg-primary p-3 rounded-lg w-fit">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">Seguridad Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Implementa medidas de seguridad robustas para proteger tus
                datos.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Abstract Shapes */}
      <div className="fixed top-0 right-0 -z-10 opacity-30">
        <div className="w-96 h-96 bg-accent rounded-full filter blur-3xl"></div>
      </div>
      <div className="fixed bottom-0 left-0 -z-10 opacity-30">
        <div className="w-96 h-96 bg-secondary rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
};

export default HomePage;
