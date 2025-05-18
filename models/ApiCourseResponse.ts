import { z } from "zod"

export const courseSchemaApi = z.object({
  id: z.number(),
  mission: z.string(),
  trainCourse: z.string(),
  commentaire: z.string().nullable().transform(data => data ?? undefined),
  ligne: z.string().nullable().transform(data => data ?? undefined),
  objectif: z.number().nullable().transform(data => data ?? undefined),
  service: z.string().nullable().transform(data => data ?? undefined),
  hd: z.string().datetime(),
  ha: z.string().datetime(),
  status: z.string(), // a remplacer plus tard par une énumaration
  departureTimeOrigin: z.string().datetime().nullable().transform(data => data ?? undefined),
  arrivalTimeTerminus: z.string().datetime().nullable().transform(data => data ?? undefined),
  placeDeparture: z.string(),
  placeArrival: z.string(),
  mesureId: z.number().nullable().transform(data => data ?? undefined),
  pds: z.string().nullable().transform(data => data ?? undefined),
  vac: z.string().nullable().transform(data => data ?? undefined), 
  createdAt: z.string().datetime(), 
  updatadAt: z.string().datetime()

}); 