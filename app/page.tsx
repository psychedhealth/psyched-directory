import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  Star,
  User,
  MapPin,
  Video,
  Wallet,
  Clock,
  Phone,
  Sparkles,
  RefreshCcw,
  SlidersHorizontal,
  X,
  LogIn,
  UserPlus,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

/**
 * Psyched - Therapist Directory (Vibe-Coded MVP)
 * -------------------------------------------------
 * Current:
 * - No sign-in required (default user/profile set)
 * - Full therapist names; star favorites
 * - Quick Match bar at top (concerns, format, budget slider)
 * - Send/Update SOS flows; reverse outreach inbox
 * - Cost chip: "Your cost ~$X" (coverage locked at 40%)
 * - Top-bar Inbox + right-rail Therapist Messages
 *
 * ASCII only; all blocks/comments closed to avoid parser issues.
 */

// ---- Mock data ------------------------------------------------------------
const COMMON_CONCERNS = [
  "Anxiety",
  "Work stress",
  "Trouble focusing",
  "Depression",
  "Burnout",
  "Life change",
  "Grief",
  "Relationship",
  "ADHD",
  "Trauma",
];

const THERAPISTS = [
  {
    id: "t1",
    name: "Dr. Jane Newman",
    creds: "PhD, Licensed Psychologist",
    years: 12,
    location: "Boston, MA (Telehealth + In-person)",
    formats: ["Telehealth", "In-person"],
    fee: 165,
    specialties: ["Anxiety", "Depression", "Trauma/PTSD", "Life Transitions"],
    bio:
      "Warm, evidence-based care integrating CBT and mindfulness. I help high-achievers untangle anxious thinking and build sustainable habits.",
    outreachAngle:
      "12 years helping clients reduce anxiety and navigate career stress with practical CBT tools and structured plans.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: "t2",
    name: "Alex Park, LMFT",
    creds: "LMFT",
    years: 8,
    location: "Cambridge, MA (Telehealth)",
    formats: ["Telehealth"],
    fee: 150,
    specialties: ["Couples", "Life Transitions", "Depression"],
    bio:
      "Collaborative, strengths-based therapist focused on communication patterns, boundaries, and repairing trust.",
    outreachAngle:
      "Couples specialist focused on rebuilding connection and reducing conflict with clear, actionable tools.",
    photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: "t3",
    name: "Maya Patel, LCSW",
    creds: "LCSW",
    years: 10,
    location: "Remote (MA, NY)",
    formats: ["Telehealth"],
    fee: 140,
    specialties: ["Anxiety", "ADHD", "Stress/Burnout"],
    bio:
      "I blend CBT with executive-function coaching to support focus, routines, and self-compassion.",
    outreachAngle:
      "ADHD-informed CBT to reduce overwhelm and create simple routines that actually stick.",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: "t4",
    name: "Jordan Lee, PsyD",
    creds: "PsyD",
    years: 6,
    location: "Somerville, MA (In-person)",
    formats: ["In-person"],
    fee: 170,
    specialties: ["Trauma/PTSD", "Depression", "Grief"],
    bio:
      "Trauma-informed, relational approach; EMDR-trained. We move at your pace, with safety first.",
    outreachAngle:
      "EMDR-informed and trauma-sensitive work for clients healing from loss and past events.",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: "t5",
    name: "Sam Rivera, LMHC",
    creds: "LMHC",
    years: 9,
    location: "Remote (MA)",
    formats: ["Telehealth"],
    fee: 135,
    specialties: ["LGBTQ+", "Anxiety", "Life Transitions"],
    bio:
      "Affirming space for LGBTQ+ clients. We'll build practical coping skills and a values-aligned plan.",
    outreachAngle:
      "LGBTQ+-affirming care centered on safety, identity, and skills for day-to-day stress.",
    photo: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: "t6",
    name: "Renee Kim, LICSW",
    creds: "LICSW",
    years: 14,
    location: "Brookline, MA (Telehealth + In-person)",
    formats: ["Telehealth", "In-person"],
    fee: 180,
    specialties: ["Workplace Issues", "Stress/Burnout", "Anxiety"],
    bio:
      "Former tech manager turned therapist; coaching-style therapy for boundaries, burnout and leadership.",
    outreachAngle:
      "Career-savvy approach for burnout and boundary-setting that respects your goals and schedule.",
    photo: "https://images.unsplash.com/photo-1546525848-3ce03ca516f6?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: "t7",
    name: "Chris O'Neal, PhD",
    creds: "PhD, Licensed Psychologist",
    years: 11,
    location: "Remote (MA, NH)",
    formats: ["Telehealth"],
    fee: 160,
    specialties: ["Anxiety", "Depression", "Grief"],
    bio:
      "Compassionate CBT/ACT blend with grief literacy. We'll clarify values and take small steps that matter.",
    outreachAngle:
      "CBT/ACT blend tailored to grief and mood - gentle, structured progress without overwhelm.",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
  {
    id: "t8",
    name: "Ava Chen, LMHC",
    creds: "LMHC",
    years: 5,
    location: "Boston, MA (Telehealth + In-person)",
    formats: ["Telehealth", "In-person"],
    fee: 120,
    specialties: ["ADHD", "Life Transitions", "Anxiety"],
    bio:
      "Practical skills for focus, routines, and motivation. Friendly accountability with weekly check-ins.",
    outreachAngle:
      "ADHD-friendly structure and small habit systems to reduce scatter and boost follow-through.",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
  },
];

// ---- Helpers --------------------------------------------------------------
function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function scoreMatch(therapist: any, quickMatch: any) {
  const { prefersTelehealth, prefersInPerson, maxFee, concernTags = [], details = "" } = quickMatch;
  let score = Math.min(100, 50 + Math.min(therapist.years * 2, 20));
  if (prefersTelehealth && therapist.formats.includes("Telehealth")) score += 8;
  if (prefersInPerson && therapist.formats.includes("In-person")) score += 8;
  if (therapist.fee <= maxFee) score += 6;
  const text = (concernTags.join(" ") + " " + details).toLowerCase();
  therapist.specialties.forEach((s: string) => {
    if (text.includes(s.toLowerCase().split("/")[0])) score += 6;
  });
  return Math.max(0, Math.min(100, Math.round(score)));
}

function firstName(full: string) {
  return (full || "").split(" ")[0];
}

// Client -> Therapist (reply)
function clientReplyOutreach({ therapist, quickMatch, clientName }: any) {
  const concerns = quickMatch.concernTags?.slice(0, 3).join(", ") || "seeking support";
  const extra = quickMatch.details?.trim() ? ` ${quickMatch.details.trim()}` : "";
  return `Hi ${firstName(therapist.name)}, this is ${clientName}. I'm looking for help with ${concerns}.${extra ? " " + extra : ""} Your background in ${therapist.specialties.slice(0,2).join(", ")} stood out - especially ${therapist.outreachAngle}. Could we set up a brief intro call?`;
}

// Therapist -> Client (reverse match)
function therapistOutreach({ therapist, quickMatch, clientName }: any) {
  const concerns = quickMatch.concernTags?.slice(0, 2).join(", ") || "your goals";
  const formats = therapist.formats.join(" / ");
  const fee = `$${therapist.fee}/session`;
  return `Hi ${firstName(clientName)}, I'm ${therapist.name}. I saw your SOS mentioning ${concerns}. I specialize in ${therapist.specialties.slice(0,2).join(", ")}, offer ${formats}, and my rate is ${fee}. If it helps, ${therapist.outreachAngle} Would you like to schedule a quick intro call?`;
}

// Client-initiated outreach template
function friendlyOutreach({ therapist, quickMatch, user }: any) {
  const fClient = user?.name ? firstName(user.name) : "Client";
  const concerns = quickMatch.concernTags?.slice(0, 3).join(", ") || "seeking support";
  const extra = quickMatch.details?.trim() ? ` ${quickMatch.details.trim()}` : "";
  return `Hi ${firstName(therapist.name)}, my name is ${fClient}. I'm looking for help with ${concerns}.${extra ? " " + extra : ""} Your background in ${therapist.specialties.slice(0,2).join(", ")} stood out - especially ${therapist.outreachAngle}. I'd love to set up a brief intro call to see if we're a fit. Thanks!`;
}

// ---- Coverage helpers -----------------------------------------------------
const COVERAGE_PERCENT = 0.4 as const; // 40%
const COVERAGE = Object.freeze({ percent: COVERAGE_PERCENT, label: "Core" as const });
function reimbursesAmount(fee: number) {
  return Math.round(fee * COVERAGE.percent);
}
function memberPaysAmount(fee: number) {
  return Math.max(0, fee - reimbursesAmount(fee));
}
function coverageBadgeText(fee: number) {
  const youPay = memberPaysAmount(fee);
  return `Your cost ~$${youPay}`;
}

// ---- Small UI bits --------------------------------------------------------
function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Badge className={cn("rounded-full px-2.5 py-1 text-[12px] font-medium whitespace-nowrap", className)}>
      {children}
    </Badge>
  );
}

function Pill({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs transition whitespace-nowrap",
        active
          ? "bg-[rgb(63,90,54)] border-[rgb(63,90,54)] text-white"
          : "bg-white border-slate-200 text-slate-700 hover:bg-[rgba(63,90,54,0.05)]"
      )}
    >
      {children}
    </button>
  );
}

function Avatar({ src, name }: { src?: string; name: string }) {
  if (!src) {
    return (
      <div className="h-16 w-16 rounded-full bg-[rgba(63,90,54,0.10)] text-[rgb(63,90,54)] flex items-center justify-center font-semibold">
        {initials(name)}
      </div>
    );
  }
  return (
    <div className="h-16 w-16 rounded-full overflow-hidden border border-[rgba(63,90,54,0.15)] bg-[rgba(63,90,54,0.05)]">
      <img src={src} alt={`${name} headshot`} className="h-full w-full object-cover" />
    </div>
  );
}

function TherapistCard({ t, onView, onMessage, isAuthed, hasProfile }: any) {
  return (
    <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-1">
        <div className="flex items-start gap-3">
          <Avatar src={t.photo} name={t.name} />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base leading-tight whitespace-normal break-words">{t.name}</CardTitle>
            <div className="text-xs text-slate-600 whitespace-normal break-words">{t.creds}</div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Chip className="bg-[rgba(63,90,54,0.10)] text-[rgb(63,90,54)]">Match {t.match}%</Chip>
              {t.formats.includes("Telehealth") && (
                <Chip className="bg-slate-100 text-slate-700"><Video className="h-3.5 w-3.5 mr-1"/> Telehealth</Chip>
              )}
              {t.formats.includes("In-person") && (
                <Chip className="bg-slate-100 text-slate-700"><MapPin className="h-3.5 w-3.5 mr-1"/> In-person</Chip>
              )}
              <Chip className="bg-slate-100 text-slate-700"><Wallet className="h-3.5 w-3.5 mr-1"/> ${t.fee}</Chip>
              <Chip className="bg-slate-100 text-slate-700"><Clock className="h-3.5 w-3.5 mr-1"/> {t.years} yrs</Chip>
              <Chip className="bg-[rgba(63,90,54,0.05)] text-[rgb(63,90,54)] border border-[rgba(63,90,54,0.25)] px-2 py-0.5 text-[11px]">{coverageBadgeText(t.fee)}</Chip>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="shrink-0"><Star className="h-4 w-4"/></Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-slate-600 flex items-center gap-1"><MapPin className="h-3.5 w-3.5"/>{t.location}</div>
        <p className="text-sm leading-relaxed">{t.bio}</p>
        <div className="flex flex-wrap gap-2">
          {t.specialties.map((s: string) => (
            <Badge key={s} variant="secondary" className="rounded-full whitespace-nowrap">{s}</Badge>
          ))}
        </div>

        <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={() => onView?.(t)} className="gap-2 whitespace-nowrap"><User className="h-4 w-4"/> View profile</Button>
            <Button size="sm" className="gap-2 whitespace-nowrap" onClick={() => onMessage?.(t)} disabled={!isAuthed || !hasProfile}><Mail className="h-4 w-4"/> Message</Button>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 text-[rgb(63,90,54)] whitespace-nowrap"><Star className="h-4 w-4"/> Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Main Component -------------------------------------------------------
export default function PsychedDirectory() {
  // Default user/profile (auth-free MVP)
  const [user, setUser] = useState<any>({ name: "Andrew Everett", email: "andrew@psychedhealth.com" });
  const [profile, setProfile] = useState<any>({ location: "Boston, MA", tier: "Breakthrough" });
  const isAuthed = !!user;
  const hasProfile = !!profile;
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const [priceMax, setPriceMax] = useState(165);
  const [openProfile, setOpenProfile] = useState<any>(null);
  const [openCompose, setOpenCompose] = useState<any>(null);
  const [outreachQueueOpen, setOutreachQueueOpen] = useState(false);

  const [quickMatch, setQuickMatch] = useState<any>({
    prefersTelehealth: true,
    prefersInPerson: false,
    maxFee: 165,
    concernTags: ["Anxiety", "Work stress", "Trouble focusing"],
    details: "",
  });
  const [sosUpdatedAt, setSosUpdatedAt] = useState(() => new Date());
  const [sosSent, setSosSent] = useState(false);
  const [autoOutreach, setAutoOutreach] = useState(true);
  const [sosSending, setSosSending] = useState(false);
  const [outreachQueue, setOutreachQueue] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(true);

  const enriched = useMemo(() => {
    return THERAPISTS.map((t) => ({ ...t, match: scoreMatch(t, quickMatch) }));
  }, [quickMatch]);

  const filtered = useMemo(() => {
    return enriched
      .filter((t: any) => t.fee <= priceMax)
      .sort((a: any, b: any) => b.match - a.match);
  }, [enriched, priceMax]);

  // Keep quickMatch.maxFee aligned with the slider
  useEffect(() => {
    setQuickMatch((q: any) => ({ ...q, maxFee: priceMax }));
  }, [priceMax]);

  // Reverse outreach inbox (guarded by sosSent)
  useEffect(() => {
    if (!autoOutreach || !isAuthed || !hasProfile || !sosSent) {
      setOutreachQueue([]);
      setUnreadCount(0);
      return;
    }
    const clientName = user?.name || "Client";
    const top = filtered.slice(0, 4);
    const msgs = top.map((t) => ({ id: t.id, therapist: t, direction: "inbound", message: therapistOutreach({ therapist: t, quickMatch, clientName }), ts: Date.now(), read: false }));
    setOutreachQueue(msgs);
    setUnreadCount(msgs.filter((m) => !m.read).length);
  }, [sosUpdatedAt, autoOutreach, filtered, quickMatch, user, isAuthed, hasProfile, sosSent]);

  // Mark inbound messages read when inbox is opened
  useEffect(() => {
    if (outreachQueueOpen) {
      setOutreachQueue((prev) => prev.map((m) => ({ ...m, read: true })));
      setUnreadCount(0);
    }
  }, [outreachQueueOpen]);

  function guarded(action: string) {
    // Auth-free MVP: allow all actions
    return true;
  }

  const handleUpdateSOS = (silent = false) => {
    if (!guarded("sos")) return;
    setSosUpdatedAt(new Date());
    setOutreachQueueOpen(true);
    if (!silent) {
      toast.success("SOS updated and sent as an update notification to your top matches.");
    } else {
      toast("SOS re-sent as an update notification.");
    }
  };

  const handleSendSOS = () => {
    if (!guarded("sos")) return;
    setSosSending(true);
    setSosUpdatedAt(new Date());
    setSosSent(true);
    setOutreachQueueOpen(true);
    toast.success("SOS sent to your top matches.");
    setSosSending(false);
  };

  const toggleConcern = (c: string) => {
    setQuickMatch((q: any) => ({
      ...q,
      concernTags: q.concernTags.includes(c)
        ? q.concernTags.filter((x: string) => x !== c)
        : [...q.concernTags, c],
    }));
  };

  const matchesCopy = filtered.length === 1 ? "1 match" : `${filtered.length} matches`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[rgba(63,90,54,0.04)] via-white to-[rgba(63,90,54,0.04)] text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-[rgb(63,90,54)]" />
          <div className="font-semibold tracking-tight">Psyched Directory</div>
          <Badge className="ml-2 bg-[rgba(63,90,54,0.10)] text-[rgb(63,90,54)] border-[rgba(63,90,54,0.25)]">MVP</Badge>
          <div className="ml-auto flex items-center gap-2">
            {!isAuthed && (
              <Button size="sm" variant="outline" className="gap-2 whitespace-nowrap" onClick={() => setAuthOpen(true)}>
                <LogIn className="h-4 w-4"/> Sign in
              </Button>
            )}
            {isAuthed && !hasProfile && (
              <Button size="sm" variant="outline" className="gap-2 whitespace-nowrap" onClick={() => setProfileOpen(true)}>
                <UserPlus className="h-4 w-4"/> Create profile
              </Button>
            )}
            {isAuthed && hasProfile && (
              <Badge variant="secondary" className="bg-[rgb(63,90,54)] text-white whitespace-nowrap">{user.name}</Badge>
            )}
            {isAuthed && hasProfile && sosSent && (
              <Sheet open={outreachQueueOpen} onOpenChange={setOutreachQueueOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 whitespace-nowrap">
                    <Mail className="h-4 w-4"/> Inbox ({unreadCount})
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[420px] sm:w-[520px]">
                  <SheetHeader>
                    <SheetTitle>Inbox</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 space-y-4">
                    {outreachQueue.map((o) => (
                      <Card key={o.id + String(o.ts)} className="shadow-sm">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <User className="h-4 w-4 text-[rgb(63,90,54)]"/>From: {o.therapist.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">{o.message}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Chip className="bg-[rgba(63,90,54,0.10)] text-[rgb(63,90,54)]">Match {o.therapist.match}%</Chip>
                              <Chip className="bg-slate-100 text-slate-700">${o.therapist.fee}/session</Chip>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="gap-2 whitespace-nowrap" disabled={!isAuthed || !hasProfile}>
                                <Phone className="h-4 w-4"/> Intro Call
                              </Button>
                              <Button size="sm" className="gap-2 whitespace-nowrap" disabled={!isAuthed || !hasProfile} onClick={() => {
                                if (!guarded("reply")) return;
                                const clientName = user?.name || "";
                                const reply = clientReplyOutreach({ therapist: o.therapist, quickMatch, clientName });
                                setOpenCompose({ ...o.therapist, prefill: reply });
                              }}>
                                <Send className="h-4 w-4"/> Reply
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>

      {/* Quick Match Bar (Top) */}
      <section className="border-b bg-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Chip className="bg-slate-100 text-slate-700">Client</Chip>
              <div className="text-sm font-medium">{user.name}</div>
              <Badge className="bg-[rgba(63,90,54,0.10)] text-[rgb(63,90,54)] border border-[rgba(63,90,54,0.25)]">Breakthrough Member</Badge>
              {hasProfile && (
                <div className="text-xs text-slate-600"> | {profile.location}</div>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex rounded-xl border p-1 bg-white">
                <Button size="sm" variant={quickMatch.prefersTelehealth ? "default" : "ghost"} onClick={() => setQuickMatch({ ...quickMatch, prefersTelehealth: !quickMatch.prefersTelehealth })} className="rounded-lg whitespace-nowrap">Telehealth</Button>
                <Button size="sm" variant={quickMatch.prefersInPerson ? "default" : "ghost"} onClick={() => setQuickMatch({ ...quickMatch, prefersInPerson: !quickMatch.prefersInPerson })} className="rounded-lg whitespace-nowrap">In-person</Button>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <Wallet className="h-4 w-4 text-[rgb(63,90,54)]"/>
                <div className="w-44">
                  <Slider min={80} max={220} step={5} value={[priceMax]} onValueChange={(v) => setPriceMax(v[0])} />
                </div>
                <div className="text-xs text-slate-600 w-20">Up to ${priceMax}</div>
              </div>
              {!sosSent ? (
                <Button className="gap-2 whitespace-nowrap" onClick={handleSendSOS} disabled={!isAuthed || !hasProfile || sosSending} title={!isAuthed || !hasProfile ? "Sign in and create a profile to send an SOS" : undefined}>
                  {sosSending ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4"/>}
                  {sosSending ? "Sending..." : "Send SOS"}
                </Button>
              ) : (
                <Button className="gap-2 whitespace-nowrap" onClick={() => handleUpdateSOS(false)}>
                  <RefreshCcw className="h-4 w-4"/> Update SOS
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 whitespace-nowrap">
                    <SlidersHorizontal className="h-4 w-4"/> Options
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Auto-outreach to top matches</Label>
                      <Switch checked={autoOutreach} onCheckedChange={setAutoOutreach} />
                    </div>
                    <Button variant="outline" size="sm" className="w-full gap-2 whitespace-nowrap" onClick={() => handleUpdateSOS(true)} disabled={!isAuthed || !hasProfile}>
                      <Send className="h-4 w-4"/> Resend update notification
                    </Button>
                    <div className="text-xs text-slate-500">Last updated: {sosUpdatedAt.toLocaleString()}</div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {COMMON_CONCERNS.map((c) => (
              <Pill key={c} active={quickMatch.concernTags.includes(c)} onClick={() => toggleConcern(c)}>
                {c}
              </Pill>
            ))}
          </div>

          <div className="pt-1">
            {!detailsOpen ? (
              <Button variant="ghost" size="sm" className="px-2 whitespace-nowrap" onClick={() => setDetailsOpen(true)}>+ Add optional details</Button>
            ) : (
              <div className="space-y-2">
                <Label className="text-sm">Optional: add context (visible to therapists)</Label>
                <Textarea
                  value={quickMatch.details}
                  onChange={(e) => setQuickMatch({ ...quickMatch, details: e.target.value })}
                  className="min-h-[90px]"
                />
                <div className="text-xs text-slate-500">Tip: 2-3 sentences about goals, preferences, or schedule.</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Results */}
        <div className="lg:col-span-9 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">{matchesCopy}</h2>
            <div className="text-xs text-slate-600">Updated {sosUpdatedAt.toLocaleTimeString()}</div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                <TherapistCard
                  t={t}
                  onView={(t: any) => setOpenProfile(t)}
                  onMessage={(t: any) => setOpenCompose(t)}
                  isAuthed={isAuthed}
                  hasProfile={hasProfile}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right rail: Messages only */}
        <div className="lg:col-span-3 space-y-6">
          {isAuthed && hasProfile && sosSent && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Therapist Messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {outreachQueue.length === 0 ? (
                  <div className="text-sm text-slate-600">No messages yet. New messages will appear here.</div>
                ) : (
                  outreachQueue.map((o) => (
                    <div key={o.id + String(o.ts)} className="flex items-start gap-3">
                      <Avatar src={o.therapist.photo} name={o.therapist.name} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium">{o.therapist.name}</div>
                        <div className="text-xs text-slate-600 mb-1">Match {o.therapist.match}% | ${o.therapist.fee}/session</div>
                        <p className="text-sm text-slate-800 whitespace-pre-wrap">{o.message}</p>
                        <div className="mt-2">
                          <Button
                            size="sm"
                            className="gap-2 whitespace-nowrap"
                            disabled={!isAuthed || !hasProfile}
                            onClick={() => {
                              if (!guarded("reply")) return;
                              const clientName = user?.name || "";
                              const reply = clientReplyOutreach({ therapist: o.therapist, quickMatch, clientName });
                              setOpenCompose({ ...o.therapist, prefill: reply });
                            }}
                          >
                            <Send className="h-4 w-4" /> Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Profile modal */}
      <Dialog open={!!openProfile} onOpenChange={() => setOpenProfile(null)}>
        <DialogContent className="sm:max-w-[640px]">
          {openProfile && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar src={openProfile.photo} name={openProfile.name} />
                  <div>
                    <div className="text-base">{openProfile.name}</div>
                    <div className="text-xs text-slate-600">{openProfile.creds} | {openProfile.years} yrs</div>
                  </div>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-600">
                  {openProfile.location} | ${openProfile.fee}/session | {openProfile.formats.join(" / ")}
                </DialogDescription>
                <div className="text-xs text-[rgb(63,90,54)] mt-1">
                  Psyched reimburses {Math.round(COVERAGE.percent * 100)}% (~${reimbursesAmount(openProfile.fee)}). Est. your cost ~${memberPaysAmount(openProfile.fee)}.
                </div>
              </DialogHeader>
              <div className="space-y-3">
                <p className="text-sm leading-relaxed">{openProfile.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {openProfile.specialties.map((s: string) => (
                    <Badge key={s} variant="secondary" className="rounded-full whitespace-nowrap">{s}</Badge>
                  ))}
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setOpenProfile(null)} className="gap-2 whitespace-nowrap"><X className="h-4 w-4"/> Close</Button>
                <Button onClick={() => { if (!guarded("compose")) return; setOpenCompose(openProfile); setOpenProfile(null); }} className="gap-2 whitespace-nowrap" disabled={!isAuthed || !hasProfile}><Mail className="h-4 w-4"/> Message</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Compose modal */}
      <Dialog open={!!openCompose} onOpenChange={() => setOpenCompose(null)}>
        <DialogContent className="sm:max-w-[620px]">
          {openCompose && (
            <>
              <DialogHeader>
                <DialogTitle>Message to {openCompose.name}</DialogTitle>
                <DialogDescription>Friendly intro that references your needs and their experience.</DialogDescription>
              </DialogHeader>
              <Textarea
                defaultValue={(openCompose as any)?.prefill ? (openCompose as any).prefill : friendlyOutreach({ therapist: openCompose, quickMatch, user })}
                className="min-h-[160px]"
              />
              <div className="flex items-center justify-between text-xs text-slate-600">
                <div>Match {openCompose.match}% | ${openCompose.fee}/session | {openCompose.formats.join(" / ")} | Reimburses {Math.round(COVERAGE.percent * 100)}% (~${reimbursesAmount(openCompose.fee)}) | You pay ~${memberPaysAmount(openCompose.fee)}</div>
                <div className="flex gap-2">
                  <Button variant="outline" className="gap-2 whitespace-nowrap" disabled={!isAuthed || !hasProfile}><Phone className="h-4 w-4"/> Request call</Button>
                  <Button className="gap-2 whitespace-nowrap" disabled={!isAuthed || !hasProfile} onClick={() => { if (!guarded("send")) return; toast.success("Message sent."); }}><Send className="h-4 w-4"/> Send</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Auth Dialog (unused in auth-free MVP, kept for later) */}
      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>Sending an SOS and messaging therapists requires an account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label className="text-sm">Email</Label>
            <Input placeholder="you@example.com" id="auth-email" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAuthOpen(false)}>Cancel</Button>
            <Button onClick={() => { const name = "Jordan"; const email = (document.getElementById("auth-email") as HTMLInputElement)?.value || ""; setUser({ name, email }); setAuthOpen(false); setTimeout(() => setProfileOpen(true), 100); toast.success("Signed in."); }}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog (optional) */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Create your profile</DialogTitle>
            <DialogDescription>Just a couple details so therapists know where you are and how to reach you.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={user?.name || ""} disabled />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled />
            </div>
            <div className="sm:col-span-2">
              <Label>Location</Label>
              <Input placeholder="City, State" id="profile-location" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProfileOpen(false)}>Skip</Button>
            <Button onClick={() => { const loc = (document.getElementById("profile-location") as HTMLInputElement)?.value || ""; setProfile({ location: loc || "Boston, MA" }); setProfileOpen(false); toast.success("Profile created."); if (pendingAction === "sos") handleUpdateSOS(false); }}>{hasProfile ? "Save" : "Create profile"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <footer className="py-10" />
    </div>
  );
}

/* DEV TESTS (compact) */
if (typeof window !== "undefined") {
  try {
    // Badge shows ~$ and numbers, and matches expected you-pay math for $200 at 40% coverage (you pay $120)
    const badge = coverageBadgeText(200);
    const hasDigit = "0123456789".split("").some((d) => badge.includes(d));
    console.assert(badge.includes("Your cost") && badge.includes("~$") && hasDigit, "badge should show 'Your cost' and ~$ amount");
    console.assert(badge.includes("120"), "badge should include calculated you-pay amount for $200");

    // Coverage percent should be 40
    const pct = Math.round(COVERAGE.percent * 100);
    console.assert(pct === 40, "coverage percent should be 40");

    // Outreach messages include fee token
    const outreach = therapistOutreach({ therapist: THERAPISTS[0], quickMatch: { concernTags: ["Anxiety"] }, clientName: "Jordan" });
    console.assert(outreach.includes("/session"), "outreach should include fee");

    // firstName helper
    console.assert(firstName("Maya Patel") === "Maya", "firstName should return first token");

    // Ensure at least one therapist supports In-person (ASCII hyphen)
    console.assert(THERAPISTS.some(t => t.formats.includes("In-person")), "In-person format should be present (ASCII hyphen)");

    // Photo URLs should be believable (Unsplash faces)
    console.assert(THERAPISTS.every(t => String(t.photo || "").includes("images.unsplash.com")), "therapist photos should use Unsplash");
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("DEV TESTS FAILED", e);
    // The error was thrown on this line (kept as JS comment)
  }
}
