import { links } from "./data/links";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Twitter, Github, Linkedin, Slack, CloudSnow } from "lucide-react"; // icon library

const icons = { twitter: Twitter, github: Github, linkedin: Linkedin, slack: Slack, "cloud-snow": CloudSnow };

export default function MyLinks() {
  return (
    <div className="flex flex-col items-center text-white">
      <div className="text-center mb-6">
        <img
          src="/Profile_pic/Profile.png"
          alt="Profile"
          className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full border-4 border-white shadow-lg mb-3 object-cover"
        />
        <h1 className="text-3xl font-bold">Gaurav Sharma</h1>
        <p className="text-gray-400">Ethical Hacker & Pentester | Network Security | Cybersecurity Professional | Pentesting - Wireshark - Nmap | React/JS Front‑End | CCNA, CompTIA A+ | Python & Java</p>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Icons row */}
  <div className="flex items-center justify-center gap-3 flex-nowrap overflow-x-auto">
          {links
            .map((l, i) => ({ l, i }))
            .filter(({ l }) => l.type === "icon" && l.icon && icons[l.icon])
            .map(({ l, i }) => {
              const Icon = icons[l.icon];
              return (
                <a
                  key={`icon-${i}`}
                  href={l.url}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 transition shrink-0"
                >
                  <Icon className="w-6 h-6 text-white" />
                </a>
              );
            })}
        </div>

        {/* Non-icon items stacked below */}
        {links.map((link, idx) => {
          if (link.type === "card") {
            return (
              <Card
                key={idx}
                className="bg-gray-800 shadow-lg hover:scale-105 transition"
              >
                <CardContent className="p-4">
                  <a
                    href={link.url}
                    className="block text-lg font-semibold"
                  >
                    {link.title}
                  </a>
                </CardContent>
              </Card>
            );
          }

          if (link.type === "button") {
            return (
              <Button
                key={idx}
                className="w-full bg-blue-600 hover:bg-blue-500 text-lg"
                onClick={() => (window.location.href = link.url)}
              >
                {link.title}
              </Button>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
