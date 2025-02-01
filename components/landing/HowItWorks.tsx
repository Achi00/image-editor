import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Cpu, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Image",
    description:
      "Simply drag and drop or select the image you want to process.",
  },
  {
    icon: Cpu,
    title: "AI Processing",
    description:
      "Our advanced AI algorithms analyze and transform your image in seconds.",
  },
  {
    icon: Download,
    title: "Download Result",
    description: "Get your transformed image instantly, ready to use or share.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="mt-4">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
