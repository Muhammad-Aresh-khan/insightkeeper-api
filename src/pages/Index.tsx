import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Key, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-primary" />
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI-DB-INSIGHTS
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enterprise License Management System
          </p>
        </header>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* User Portal */}
          <Card className="p-8 hover:shadow-lg transition-shadow bg-card border-border">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">User Portal</h2>
                <p className="text-muted-foreground">
                  Access your license dashboard and manage your account
                </p>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Link to="/user/login" className="w-full">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/user/signup" className="w-full">
                  <Button variant="outline" className="w-full border-border hover:bg-accent">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Admin Portal */}
          <Card className="p-8 hover:shadow-lg transition-shadow bg-card border-border">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Key className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Admin Portal</h2>
                <p className="text-muted-foreground">
                  Manage licenses and oversee system operations
                </p>
              </div>
              <Link to="/admin/login" className="w-full">
                <Button className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                  Admin Access
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg bg-gradient-hero">
            <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">Secure Access</h3>
            <p className="text-sm text-muted-foreground">Enterprise-grade security for all accounts</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gradient-hero">
            <Key className="w-10 h-10 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">License Management</h3>
            <p className="text-sm text-muted-foreground">Easy creation and renewal of licenses</p>
          </div>
          <div className="text-center p-6 rounded-lg bg-gradient-hero">
            <Users className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">User Dashboard</h3>
            <p className="text-sm text-muted-foreground">Real-time license status tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
