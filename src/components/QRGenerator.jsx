import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Settings2, RefreshCw, QrCode, Palette } from "lucide-react";

const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [size, setSize] = useState(200);
  const [format, setFormat] = useState("png");
  const [qrColor, setQRColor] = useState("FFFFFF");
  const [bgColor, setBgColor] = useState("000000");
  const [loading, setLoading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQRCode = () => {
    if (!text) return;

    setLoading(true);
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const params = new URLSearchParams({
      data: text,
      size: `${size}x${size}`,
      format,
      color: qrColor,
      bgcolor: bgColor,
    });

    const url = `${baseUrl}?${params.toString()}`;
    setQrCodeUrl(url);
    setLoading(false);
  };

  const downloadQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `qrcode.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 md:p-8">
      <div className="md:max-w-4xl mx-auto">
        <Card className="bg-slate-900 border-slate-800 shadow-2xl">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-3xl font-bold text-center text-white flex items-center justify-center gap-2">
              <QrCode className="w-8 h-8 text-purple-500" />
              QR Code Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="generate" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 b  bg-slate-900">
                <TabsTrigger
                  value="generate"
                  className="rounded-xl text-gray-100"
                >
                  Generate
                </TabsTrigger>
                <TabsTrigger
                  value="customize"
                  className="rounded-xl text-gray-100"
                >
                  Customize
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generate">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column - Main Input */}
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-300">
                        Content
                      </label>
                      <Input
                        placeholder="Enter text or URL"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                      />
                    </div>

                    <Button
                      onClick={generateQRCode}
                      disabled={!text || loading}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {loading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Settings2 className="w-4 h-4 mr-2" />
                      )}
                      Generate QR Code
                    </Button>
                  </div>

                  {/* Right Column - Preview */}
                  <div className="flex flex-col items-center justify-center space-y-6">
                    <div className="w-full aspect-square bg-slate-800 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-700 p-4">
                      {qrCodeUrl ? (
                        <img
                          src={qrCodeUrl}
                          alt="Generated QR Code"
                          className="max-w-full max-h-full"
                        />
                      ) : (
                        <div className="text-slate-500 text-center">
                          <Palette className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-lg">QR Code Preview</p>
                          <p className="text-sm">
                            Generate a QR code to see it here
                          </p>
                        </div>
                      )}
                    </div>

                    {qrCodeUrl && (
                      <Button
                        onClick={downloadQRCode}
                        variant="outline"
                        className="w-full border-slate-700 text-slate-50 bg-purple-600 hover:bg-purple-700 hover:text-slate-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download QR Code
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customize" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-4 ">
                      <label className="text-sm font-medium text-slate-300">
                        Size: {size}x{size}px
                      </label>
                      <Slider
                        value={[size]}
                        onValueChange={(value) => setSize(value[0])}
                        min={100}
                        max={500}
                        step={50}
                        className="w-full border border-slate-700"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-300">
                        Format
                      </label>
                      <Select value={format} onValueChange={setFormat}>
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="svg">SVG</SelectItem>
                          <SelectItem value="jpg">JPG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-300">
                        QR Code Color
                      </label>
                      <Input
                        type="color"
                        value={`#${qrColor}`}
                        onChange={(e) =>
                          setQRColor(e.target.value.substring(1))
                        }
                        className="w-full h-12 bg-slate-800 border-slate-700"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-medium text-slate-300">
                        Background Color
                      </label>
                      <Input
                        type="color"
                        value={`#${bgColor}`}
                        onChange={(e) =>
                          setBgColor(e.target.value.substring(1))
                        }
                        className="w-full h-12 bg-slate-800 border-slate-700"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="text-center space-y-4 text-slate-400">
                      <Palette className="w-16 h-16 mx-auto text-purple-500" />
                      <p className="text-lg font-medium text-white">
                        Customize Your QR Code
                      </p>
                      <p>
                        Adjust size, colors, and format to create the perfect QR
                        code for your needs.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
