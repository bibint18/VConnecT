
import React, { useState, useEffect } from "react";
import { format, isAfter, isBefore, isEqual } from "date-fns";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosInstance from "@/utils/axiosInterceptor";

if (pdfMake && pdfFonts) {
  pdfMake.vfs = {
    "Roboto-Regular.ttf": pdfFonts["Roboto-Regular.ttf"],
    "Roboto-Medium.ttf": pdfFonts["Roboto-Medium.ttf"],
    "Roboto-Italic.ttf": pdfFonts["Roboto-Italic.ttf"],
    "Roboto-MediumItalic.ttf": pdfFonts["Roboto-MediumItalic.ttf"],
  };
  pdfMake.fonts = {
    Roboto: {
      normal: "Roboto-Regular.ttf",
      bold: "Roboto-Medium.ttf",
      italics: "Roboto-Italic.ttf",
      bolditalics: "Roboto-MediumItalic.ttf",
    },
  };
} else {
  console.error("pdfMake or pdfFonts not loaded. pdfMake:", pdfMake, "pdfFonts:", pdfFonts);
}

interface DashboardData {
  totalUsers: number;
  premiumUsers: number;
  popularPlans: { planName: string; count: number; discountAmount: number }[];
  totalIncome: number;
  incomeOverTime: { year: number; month: number; total: number }[];
  totalRooms: number;
  roomTypes: { type: "PUBLIC" | "PRIVATE"; count: number }[];
  userCreationOverTime: { year: number; month: number; count: number }[];
  revenueDetails: { userName: string; email: string; planName: string; amount: number; purchaseDate: string }[];
  userDetails: { userName: string; email: string; createdAt: string; isPremium: boolean }[];
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const params = startDate && endDate ? { startDate: new Date(startDate.setHours(0, 0, 0, 0)).toISOString(), endDate: new Date(endDate.setHours(23, 59, 59, 999)).toISOString() } : {};
      const response = await axiosInstance.get("/dashboard", {
        params,
      });
      setData(response.data);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    try {
      if (!pdfMake) {
        throw new Error("pdfMake is not loaded. Please check module imports.");
      }
      const documentDefinition: any = {
        content: [],
        styles: {
          header: { fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
          subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
          tableHeader: { bold: true, fontSize: 10, color: "white", fillColor: "#646464" },
          tableCell: { fontSize: 10, margin: [0, 2, 0, 2] },
          metric: { fontSize: 12, margin: [0, 5, 0, 5] },
        },
        defaultStyle: { font: "Roboto" },
        pageMargins: [40, 20, 40, 20],
      };

      documentDefinition.content.push(
        { text: "Admin Dashboard Report", style: "header" },
        {
          text: `Date Range: ${startDate ? format(startDate, "PPP") : "All"} - ${endDate ? format(endDate, "PPP") : "All"}`,
          style: "metric",
        }
      );

      if (data) {
        documentDefinition.content.push(
          { text: `Total Users: ${data.totalUsers}`, style: "metric" },
          { text: `Premium Users: ${data.premiumUsers}`, style: "metric" },
          { text: `Total Income: $${data.totalIncome}`, style: "metric" },
          { text: `Total Rooms: ${data.totalRooms}`, style: "metric" },
          { text: `Public Rooms: ${data.roomTypes.find(r => r.type === "PUBLIC")?.count || 0}`, style: "metric" },
          { text: `Private Rooms: ${data.roomTypes.find(r => r.type === "PRIVATE")?.count || 0}`, style: "metric" },
          { text: "", margin: [0, 10, 0, 0] } 
        );

        documentDefinition.content.push(
          { text: "Revenue Details", style: "subheader" },
          {
            table: {
              headerRows: 1,
              widths: ["*", "*", "*", "auto", "auto"],
              body: [
                [
                  { text: "User Name", style: "tableHeader" },
                  { text: "Email", style: "tableHeader" },
                  { text: "Plan Name", style: "tableHeader" },
                  { text: "Amount", style: "tableHeader" },
                  { text: "Purchase Date", style: "tableHeader" },
                ],
                ...data.revenueDetails.map(item => [
                  { text: item.userName || "N/A", style: "tableCell" },
                  { text: item.email || "N/A", style: "tableCell" },
                  { text: item.planName || "N/A", style: "tableCell" },
                  { text: item.amount != null ? `$${item.amount}` : "N/A", style: "tableCell" },
                  { text: item.purchaseDate ? format(new Date(item.purchaseDate), "PPP") : "N/A", style: "tableCell" },
                ]),
              ],
            },
            layout: "lightHorizontalLines",
          },
          { text: `Total Income: $${data.totalIncome}`, style: "metric", margin: [0, 10, 0, 10] }
        );

        documentDefinition.content.push(
          { text: "User Creation Details", style: "subheader" },
          {
            table: {
              headerRows: 1,
              widths: ["*", "*", "*", "auto"],
              body: [
                [
                  { text: "User Name", style: "tableHeader" },
                  { text: "Email", style: "tableHeader" },
                  { text: "Created At", style: "tableHeader" },
                  { text: "Premium Status", style: "tableHeader" },
                ],
                ...data.userDetails.map(item => [
                  { text: item.userName || "N/A", style: "tableCell" },
                  { text: item.email || "N/A", style: "tableCell" },
                  { text: item.createdAt ? format(new Date(item.createdAt), "PPP") : "N/A", style: "tableCell" },
                  { text: item.isPremium ? "Yes" : "No", style: "tableCell" },
                ]),
              ],
            },
            layout: "lightHorizontalLines",
          },
          { text: `Total Users Joined: ${data.userDetails.length}`, style: "metric", margin: [0, 10, 0, 10] }
        );

        
        const chart1 = document.getElementById("user-chart");
        const chart2 = document.getElementById("income-chart");
        if (chart1 && chart2) {
          const canvas1 = await html2canvas(chart1);
          const imgData1 = canvas1.toDataURL("image/png");
          documentDefinition.content.push(
            { text: "User Creation Over Time Chart", style: "subheader", margin: [0, 20, 0, 5] },
            { image: imgData1, width: 450, height: 200 }
          );

          const canvas2 = await html2canvas(chart2);
          const imgData2 = canvas2.toDataURL("image/png");
          documentDefinition.content.push(
            { text: "Income Over Time Chart", style: "subheader", margin: [0, 20, 0, 5] },
            { image: imgData2, width: 450, height: 200 }
          );
        }
      }

      pdfMake.createPdf(documentDefinition).download(`dashboard-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.success("PDF downloaded");
    } catch (error: unknown) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const downloadExcel = () => {
    if (!data) return;

    const wb = XLSX.utils.book_new();
    
    const summaryData = [
      ["Metric", "Value"],
      ["Total Users", data.totalUsers],
      ["Premium Users", data.premiumUsers],
      ["Total Income", `$${data.totalIncome}`],
      ["Total Rooms", data.totalRooms],
      ["Public Rooms", data.roomTypes.find(r => r.type === "PUBLIC")?.count || 0],
      ["Private Rooms", data.roomTypes.find(r => r.type === "PRIVATE")?.count || 0],
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    ws1['!cols'] = [{ wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws1, "Summary");

    const plansData = [["Plan Name", "Count", "Discount Amount"], ...data.popularPlans.map(p => [p.planName, p.count, p.discountAmount])];
    const ws2 = XLSX.utils.aoa_to_sheet(plansData);
    ws2['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Popular Plans");

    const incomeData = [["Year", "Month", "Total"], ...data.incomeOverTime.map(i => [i.year, i.month, i.total])];
    const ws3 = XLSX.utils.aoa_to_sheet(incomeData);
    ws3['!cols'] = [{ wch: 15 }, { wch: 15 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws3, "Income Over Time");

    const revenueData = [
      ["User Name", "Email", "Plan Name", "Amount", "Purchase Date"],
      ...data.revenueDetails.map(item => [
        item.userName || "N/A",
        item.email || "N/A",
        item.planName || "N/A",
        item.amount != null ? `$${item.amount}` : "N/A",
        item.purchaseDate ? format(new Date(item.purchaseDate), "PPP") : "N/A",
      ]),
      ["Total Income", "", "", `$${data.totalIncome}`, ""],
    ];
    const ws4 = XLSX.utils.aoa_to_sheet(revenueData);
    ws4['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws4, "Revenue Details");

    const userData = [
      ["User Name", "Email", "Created At", "Premium Status"],
      ...data.userDetails.map(item => [
        item.userName || "N/A",
        item.email || "N/A",
        item.createdAt ? format(new Date(item.createdAt), "PPP") : "N/A",
        item.isPremium ? "Yes" : "No",
      ]),
      ["Total Users Joined", "", "", data.userDetails.length],
    ];
    const ws5 = XLSX.utils.aoa_to_sheet(userData);
    ws5['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 20 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws5, "User Details");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `dashboard-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Excel downloaded");
  };

  const today = new Date();

  const handleStartDateSelect = (date: Date | undefined) => {
    if (!date) {
      setStartDate(undefined);
      return;
    }

    if (isAfter(date, today)) {
      toast.error("Start date cannot be in the future");
      return;
    }

    setStartDate(date);

    if (endDate && (isBefore(endDate, date) || isEqual(endDate, date))) {
      setEndDate(undefined);
      toast.error("End date has been reset because it was earlier than or equal to the new start date");
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (!date) {
      setEndDate(undefined);
      return;
    }

    if (isAfter(date, today)) {
      toast.error("End date cannot be in the future");
      return;
    }

    if (startDate && (isBefore(date, startDate))) {
      toast.error("End date cannot be before start date");
      return;
    }

    setEndDate(date);
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!data) return <div className="text-red-500 text-center mt-10">Failed to load data</div>;

  return (
    <div className="container !bg-pink-50 mx-auto p-6 !text-black">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="mb-6 flex gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Start Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateSelect}
              initialFocus
              disabled={(date: Date) => isAfter(date, today)}
              classNames={{
                day_disabled: "!text-gray-400 !cursor-not-allowed",
              }}
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : "End Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateSelect}
              initialFocus
              disabled={(date: Date) =>
                (startDate && (isBefore(date, startDate))) ||
                isAfter(date, today)
              }
              classNames={{
                day_disabled: "!text-gray-400 !cursor-not-allowed",
              }}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={() => { setStartDate(undefined); setEndDate(undefined); }}>
          Clear Dates
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>User Creation Over Time</CardTitle>
          </CardHeader>
          <CardContent id="user-chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.userCreationOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={(d) => `${d.month}/${d.year}`}
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Income Over Time</CardTitle>
          </CardHeader>
          <CardContent id="income-chart">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.incomeOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={(d) => `${d.month}/${d.year}`}
                  tickFormatter={(value) => value}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Premium Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.premiumUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.totalRooms}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Public Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.roomTypes.find(r => r.type === "PUBLIC")?.count || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Private Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{data.roomTypes.find(r => r.type === "PRIVATE")?.count || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Most Purchased Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Discount Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.popularPlans.map((plan) => (
                <TableRow key={plan.planName}>
                  <TableCell>{plan.planName}</TableCell>
                  <TableCell>{plan.count}</TableCell>
                  <TableCell>${plan.discountAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-4">
        <Button onClick={downloadPDF}>Download PDF</Button>
        <Button onClick={downloadExcel}>Download Excel</Button>
      </div>
    </div>
  );
};

export default AdminDashboard;