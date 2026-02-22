import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, QrCode, Mail, MessageCircle, CreditCard, MapPin } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const placeholders = [
  { title: "NFC Redirect", description: "NFC tags will redirect users to their digital profile page via a unique URL.", icon: Wifi },
  { title: "QR Generator", description: "Auto-generate QR codes linked to each user profile for easy sharing.", icon: QrCode },
  { title: "SMTP Email", description: "Email notifications for enquiries, appointments, and subscription alerts.", icon: Mail },
  { title: "WhatsApp API", description: "WhatsApp integration for direct messaging and notifications.", icon: MessageCircle },
  { title: "Payment Gateway", description: "Secure payment processing for subscriptions and product purchases.", icon: CreditCard },
  { title: "Google Maps API", description: "Embed location maps on profile pages for business addresses.", icon: MapPin },
];

const TechPlaceholders = () => (
  <section className="container py-8">
    <h2 className="mb-6 text-center text-xl font-semibold">Tech Integrations</h2>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {placeholders.map((p) => (
        <Card key={p.title}>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <p.icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{p.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{p.description}</p>
            <span className="mt-2 inline-block text-xs font-medium text-muted-foreground/60">Placeholder — integration pending</span>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);

export default TechPlaceholders;
