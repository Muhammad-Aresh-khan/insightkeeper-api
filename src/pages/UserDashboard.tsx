import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, LogOut, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseStatus, setLicenseStatus] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("userSession");
    if (!session) {
      navigate("/user/login");
      return;
    }
    const { username } = JSON.parse(session);
    setUsername(username);
  }, [navigate]);

  const handleValidateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    try {
      const response = await fetch("http://localhost:8000/license/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ license_key: licenseKey }),
      });

      const data = await response.json();

      if (data.error) {
        setLicenseStatus({ valid: false, message: data.error });
        toast({
          variant: "destructive",
          title: "Invalid License",
          description: data.error,
        });
      } else {
        setLicenseStatus({ valid: true, message: data.message });
        toast({
          title: "License Valid",
          description: data.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to validate license",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };

  const getStatusIcon = () => {
    if (!licenseStatus) return <AlertCircle className="w-12 h-12 text-muted-foreground" />;
    return licenseStatus.valid ? (
      <CheckCircle className="w-12 h-12 text-success" />
    ) : (
      <XCircle className="w-12 h-12 text-destructive" />
    );
  };

  const getStatusBadge = () => {
    if (!licenseStatus) return null;
    return licenseStatus.valid ? (
      <Badge className="bg-success text-success-foreground">Active</Badge>
    ) : (
      <Badge variant="destructive">Invalid</Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {username}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-border hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* License Validation Form */}
          <Card className="p-8 bg-card border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Validate License</h2>
            </div>

            <form onSubmit={handleValidateLicense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="license">License Key</Label>
                <Input
                  id="license"
                  type="text"
                  placeholder="Enter your license key"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  required
                  className="bg-background border-border font-mono"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isValidating}
              >
                {isValidating ? "Validating..." : "Validate License"}
              </Button>
            </form>
          </Card>

          {/* License Status */}
          <Card className="p-8 bg-card border-border shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">License Status</h2>
              {getStatusBadge()}
            </div>

            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              {getStatusIcon()}
              <p className="text-center text-muted-foreground">
                {licenseStatus
                  ? licenseStatus.message
                  : "Enter a license key to check its status"}
              </p>
            </div>

            {licenseStatus && (
              <div className="mt-6 p-4 rounded-lg bg-gradient-hero">
                <h3 className="font-semibold text-foreground mb-2">Details</h3>
                <p className="text-sm text-muted-foreground break-all">{licenseStatus.message}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-8 max-w-6xl mx-auto">
          <Card className="p-6 bg-gradient-hero border-border">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              License Information
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Enter your license key to validate its status and expiration date</li>
              <li>• Active licenses will display package details and validity period</li>
              <li>• Contact your administrator for license renewal or support</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
