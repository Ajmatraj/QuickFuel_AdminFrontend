"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { AlertCircle, ArrowLeft, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

interface FuelStation {
  _id: string
  name: string
  location: string
  owner: string
  stationImage: string
  fuelTypes: string[]
  status: string
  description?: string
  contactNumber?: string
  email?: string
  operatingHours?: string
  attachments?: {
    name: string
    url: string
    type: string
  }[]
  createdAt: string
  updatedAt: string
  __v: number
}

const fuelTypeOptions = [
  { id: "petrol", label: "Petrol" },
  { id: "diesel", label: "Diesel" },
  { id: "premium", label: "Premium" },
  { id: "electric", label: "Electric" },
  { id: "cng", label: "CNG" },
]

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  location: z.string().min(5, { message: "Location must be at least 5 characters." }),
  owner: z.string().min(2, { message: "Owner name must be at least 2 characters." }),
  description: z.string().optional(),
  contactNumber: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal("")),
  operatingHours: z.string().optional(),
  status: z.enum(["active", "inactive"]),
  fuelTypes: z.array(z.string()).min(1, { message: "Select at least one fuel type." }),
})

export default function StationEditPage() {
  const params = useParams()
  const router = useRouter()
  const stationId = params.id as string

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [existingAttachments, setExistingAttachments] = useState<any[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      owner: "",
      description: "",
      contactNumber: "",
      email: "",
      operatingHours: "",
      status: "active",
      fuelTypes: [],
    },
  })

  useEffect(() => {
    if (stationId) {
      fetchStationDetails(stationId)
    }
  }, [stationId])

  const fetchStationDetails = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8000/api/v1/fuelstations/stationbyid/${id}`)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        const station = data.data as FuelStation

        // Set form values
        form.reset({
          name: station.name,
          location: station.location,
          owner: station.owner,
          description: station.description || "",
          contactNumber: station.contactNumber || "",
          email: station.email || "",
          operatingHours: station.operatingHours || "",
          status: station.status.toLowerCase() as "active" | "inactive",
          fuelTypes: station.fuelTypes || [],
        })

        // Set existing attachments
        if (station.attachments) {
          setExistingAttachments(station.attachments)
        }
      } else {
        throw new Error(data.message || "Failed to fetch station details")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error fetching station details:", err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true)

      // Create FormData for file uploads
      const formData = new FormData()

      // Add form values to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key === "fuelTypes") {
          // Handle array values
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, value as string)
        }
      })

      // Add files to FormData
      files.forEach((file) => {
        formData.append("attachments", file)
      })

      // Add existing attachments to keep
      formData.append("existingAttachments", JSON.stringify(existingAttachments))

      const response = await fetch(`http://localhost:8000/api/v1/stations/updateStationById/${stationId}`, {
        method: "PUT",
        body: formData,
        // Don't set Content-Type header when using FormData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        router.push(`/station-details/${stationId}`)
      } else {
        throw new Error(data.message || "Failed to update station")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error updating station:", err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeExistingAttachment = (index: number) => {
    setExistingAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center p-8">Loading station details...</div>
      </div>
    )
  }

  if (error && !form.formState.isDirty) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center p-8 text-red-500">
          <AlertCircle className="mr-2 h-5 w-5" />
          <span>Error loading station details: {error}</span>
        </div>
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold ml-4">Edit Fuel Station</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Station Details</CardTitle>
          <CardDescription>Update the information for this fuel station</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Station Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter station name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter station location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter owner name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="operatingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operating Hours</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 9AM - 9PM, Monday to Sunday" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter station description" className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelTypes"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Fuel Types</FormLabel>
                      <FormDescription>Select the types of fuel available at this station</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {fuelTypeOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="fuelTypes"
                          render={({ field }) => {
                            return (
                              <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, option.id])
                                        : field.onChange(field.value?.filter((value) => value !== option.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{option.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Label htmlFor="attachments">Attachments</Label>
                <div className="mt-2">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF, PNG, JPG or other documents</p>
                      </div>
                      <input id="file-upload" type="file" className="hidden" multiple onChange={handleFileChange} />
                    </label>
                  </div>
                </div>

                {files.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">New Files to Upload:</h4>
                    <ul className="space-y-2">
                      {Array.from(files).map((file, index) => (
                        <li key={index} className="text-sm flex items-center p-2 border rounded">
                          <span className="flex-1 truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setFiles(files.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {existingAttachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Existing Attachments:</h4>
                    <ul className="space-y-2">
                      {existingAttachments.map((attachment, index) => (
                        <li key={index} className="text-sm flex items-center p-2 border rounded">
                          <span className="flex-1 truncate">{attachment.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExistingAttachment(index)}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <CardFooter className="flex justify-between px-0">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
