import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Key, LogOut, Plus, RefreshCw, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [packages, setPackages] = useState<any>({});
  const [selectedPackage, setSelectedPackage] = useState("");
  const [renewLicenseKey, setRenewLicenseKey] = useState("");
  const [renewPackage, setRenewPackage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem("adminSession");
    if (!session) {
      navigate("/admin/login");
      return;
    }
    const { username } = JSON.parse(session);
    setUsername(username);
    fetchPackages();
  }, [navigate]);

  const fetchPackages = async () => {
    try {
      const response = await fetch("http://localhost:8000/license/packages_selection");
      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch packages",
      });
    }
  };

  const handleCreateLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const response = await fetch("http://localhost:8000/license/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packages: selectedPackage }),
      });

      const data = await response.json();

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: data.error,
        });
      } else {
        toast({
          title: "License Created",
          description: data.message,
        });
        setSelectedPackage("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create license",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleRenewLicense = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRenewing(true);

    try {
      const response = await fetch("http://localhost:8000/license/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packages: renewPackage,
          license_key: renewLicenseKey,
        }),
      });

      const data = await response.json();

      if (data.error) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: data.error,
        });
      } else {
        toast({
          title: "License Renewed",
          description: data.message,
        });
        setRenewLicenseKey("");
        setRenewPackage("");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to renew license",
      });
    } finally {
      setIsRenewing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    toast({
      title: "Logged Out",
      description: "Admin session ended",
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <Key className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {username}</p>
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

        {/* Package Info */}
        <Card className="mb-8 p-6 bg-gradient-hero border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Available License Packages
          </h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(packages).map(([name, days]: [string, any]) => (
              <Badge key={name} className="bg-primary text-primary-foreground">
                {name}: {days} days
              </Badge>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Create License */}
          <Card className="p-8 bg-card border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Create New License</h2>
            </div>

            <form onSubmit={handleCreateLicense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="package">Select Package</Label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage} required>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Choose a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(packages).map((pkg) => (
                      <SelectItem key={pkg} value={pkg}>
                        {pkg} - {packages[pkg]} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isCreating || !selectedPackage}
              >
                {isCreating ? "Creating..." : "Create License"}
              </Button>
            </form>
          </Card>

          {/* Renew License */}
          <Card className="p-8 bg-card border-border shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="w-8 h-8 text-secondary" />
              <h2 className="text-2xl font-bold text-foreground">Renew License</h2>
            </div>

            <form onSubmit={handleRenewLicense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="renewKey">License Key</Label>
                <Input
                  id="renewKey"
                  type="text"
                  placeholder="Enter license key to renew"
                  value={renewLicenseKey}
                  onChange={(e) => setRenewLicenseKey(e.target.value)}
                  required
                  className="bg-background border-border font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="renewPackage">New Package</Label>
                <Select value={renewPackage} onValueChange={setRenewPackage} required>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Choose renewal package" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(packages).map((pkg) => (
                      <SelectItem key={pkg} value={pkg}>
                        {pkg} - {packages[pkg]} days
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                disabled={isRenewing || !renewLicenseKey || !renewPackage}
              >
                {isRenewing ? "Renewing..." : "Renew License"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
