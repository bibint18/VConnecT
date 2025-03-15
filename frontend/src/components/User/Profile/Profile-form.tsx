// "use client"

// import { useState } from "react"
// import { Check, Pencil } from "lucide-react"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { FormControl, FormItem, FormLabel } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Textarea } from "@/components/ui/textarea"

// interface UserProfile {
//   name: string
//   email: string
//   avatar: string
//   fullName: string
//   userName: string
//   gender: string
//   country: string
//   mobile: string
//   description: string
// }

// // This would come from your auth middleware
// const mockUser: UserProfile = {
//   name: "Alexa Rawles",
//   email: "alexarawles@gmail.com",
//   avatar: "/placeholder.svg",
//   fullName: "Alexa Rawles",
//   userName: "alexarawles",
//   gender: "Female",
//   country: "United States",
//   mobile: "+91 6282004567",
//   description: "UI/UX Designer & Developer",
// }

// export function ProfileForm() {
//   const [isEditing, setIsEditing] = useState(false)
//   const [user] = useState<UserProfile>(mockUser)

//   return (
//     <div className="mx-auto max-w-4xl space-y-6">
//       <div className="flex items-center justify-between">
//         <Card className="w-full">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-4">
//                 <Avatar className="h-16 w-16">
//                   <AvatarImage src={user.avatar} alt={user.name} />
//                   <AvatarFallback>AR</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <CardTitle>{user.name}</CardTitle>
//                   <CardDescription>{user.email}</CardDescription>
//                 </div>
//               </div>
//               <Button variant="outline" size="icon" onClick={() => setIsEditing(!isEditing)}>
//                 {isEditing ? <Check className="h-5 w-5" /> : <Pencil className="h-5 w-5" />}
//               </Button>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div className="grid gap-6 md:grid-cols-2">
//               <FormItem>
//                 <FormLabel>Full Name</FormLabel>
//                 <FormControl>
//                   <Input disabled={!isEditing} placeholder="Enter your full name" defaultValue={user.fullName} />
//                 </FormControl>
//               </FormItem>
//               <FormItem>
//                 <FormLabel>User Name</FormLabel>
//                 <FormControl>
//                   <Input disabled={!isEditing} placeholder="Enter your username" defaultValue={user.userName} />
//                 </FormControl>
//               </FormItem>
//               <FormItem>
//                 <FormLabel>Gender</FormLabel>
//                 <Select disabled={!isEditing} defaultValue={user.gender}>
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select your gender" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Male">Male</SelectItem>
//                     <SelectItem value="Female">Female</SelectItem>
//                     <SelectItem value="Other">Other</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </FormItem>
//               <FormItem>
//                 <FormLabel>Country</FormLabel>
//                 <FormControl>
//                   <Input disabled={!isEditing} placeholder="Enter your country" defaultValue={user.country} />
//                 </FormControl>
//               </FormItem>
//               <FormItem>
//                 <FormLabel>Mobile</FormLabel>
//                 <FormControl>
//                   <Input disabled={!isEditing} placeholder="Enter your mobile number" defaultValue={user.mobile} />
//                 </FormControl>
//               </FormItem>
//               <FormItem>
//                 <FormLabel>Description</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     disabled={!isEditing}
//                     placeholder="Enter a brief description"
//                     defaultValue={user.description}
//                   />
//                 </FormControl>
//               </FormItem>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <Check className="h-5 w-5 text-primary" />
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">My email Address</p>
//                   <p className="text-sm text-muted-foreground">
//                     {user.email}
//                     <span className="ml-2 text-xs text-muted-foreground">1 month ago</span>
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-4">
//                 <Check className="h-5 w-5 text-primary" />
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">My mobile number</p>
//                   <p className="text-sm text-muted-foreground">
//                     {user.mobile}
//                     <span className="ml-2 text-xs text-muted-foreground">1 month ago</span>
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

