import { z } from "zod";

export const InstrumentSchema = z.enum(["Piano", "Drums", "Violin", "Trumpet"]);
export type Instrument = z.infer<typeof InstrumentSchema>;

export const RoleSchema = z.enum(["Manager", "Teacher", "IT Admin"]);
export type Role = z.infer<typeof RoleSchema>;

export const DaySchema = z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
export type DayCode = z.infer<typeof DaySchema>;

export const RankingStrategySchema = z.enum(["WorkloadDeficit", "PreferenceMatch"]);
export type RankingStrategy = z.infer<typeof RankingStrategySchema>;

export const RejectionReasonSchema = z.enum([
  "Medical / Personal",
  "Schedule Conflict",
  "Pedagogical Grade Mismatch",
]);
export type RejectionReason = z.infer<typeof RejectionReasonSchema>;

export const ProvisionAccountFormSchema = z
  .object({
    staffId: z
      .string()
      .trim()
      .regex(/^(T|M|IT)-\d{2}$/, "Use format T-11, M-03, or IT-02"),
    fullName: z.string().trim().min(2, "Enter full name"),
    email: z
      .string()
      .trim()
      .email("Enter valid school email")
      .endsWith("@harmony.edu.sg", "Must end with @harmony.edu.sg"),
    contact: z
      .string()
      .trim()
      .regex(/^\+65\s?\d{4}\s?\d{4}$/, "Use +65 XXXX XXXX"),
    role: RoleSchema,
    instruments: z.array(InstrumentSchema),
    homeStudio: z.string(),
  })
  .refine((val) => (val.role === "Teacher" ? val.instruments.length > 0 : true), {
    message: "Select at least one certified instrument for a Teacher",
    path: ["instruments"],
  });

export const AvailabilitySubmissionSchema = z.object({
  declaredHours: z
    .number()
    .min(60.0, "Monthly availability must be at least 60.0 hours before submission"),
  preferredDays: z.array(DaySchema).min(1, "Select at least one preferred teaching day"),
  preferredStudio: z.string().min(1),
});

export const MaintenanceWindowFormSchema = z
  .object({
    studioId: z.string().min(1),
    weekId: z.string().min(1),
    day: DaySchema,
    startSlot: z.string().min(1),
    endSlot: z.string().min(1),
    reason: z.string().trim().min(3, "Enter maintenance reason"),
  })
  .refine((v) => v.endSlot > v.startSlot, {
    message: "End time must be after start time",
    path: ["endSlot"],
  });

export const OvertimeConfirmSchema = z.object({
  justification: z.string().trim().min(6, "Enter manager justification (min 6 chars)"),
});

export const RejectionRequestSchema = z.object({
  acknowledgedWarning: z.literal(true, {
    errorMap: () => ({ message: "Confirm that you will consult your manager" }),
  }),
  reason: RejectionReasonSchema,
  note: z.string().trim().min(4, "Add a brief note for the manager"),
});
