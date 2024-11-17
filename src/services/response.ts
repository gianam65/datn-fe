export type LicensePlatesResponse = {
  engine_number: string
  frame_number: string
  image_url?: string
  license_plate: string
  status: string
  id: number
}

export type CarType = {
  carId: string
  frameNumber: string
  status: boolean
  engineNumber: string
  imageUrl?: string
}
