
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
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
  // BarChart,
  // Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosInstance from "@/utils/axiosInterceptor";

interface DashboardData {
  totalUsers: number;
  premiumUsers: number;
  popularPlans: { planName: string; count: number; discountAmount: number }[];
  totalIncome: number;
  incomeOverTime: { year: number; month: number; total: number }[];
  totalRooms: number;
  roomTypes: { type: "PUBLIC" | "PRIVATE"; count: number }[];
  userCreationOverTime: { year: number; month: number; count: number }[];
}

const AdminDashboardd: React.FC = () => {
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
      const params = startDate && endDate ? { startDate: startDate.toISOString(), endDate: endDate.toISOString() } : {};
      const response = await axiosInstance.get("/dashboard", {
        params,
      });
      setData(response.data);
    } catch (error:unknown) {
      // toast.error("Failed to load dashboard data");
      toast.error(error instanceof Error ? error.message : "Failed to ;load dashbpoard data");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const doc = new jsPDF();
    doc.text("Admin Dashboard", 20, 20);
    doc.text(`Date Range: ${startDate ? format(startDate, "PPP") : "All"} - ${endDate ? format(endDate, "PPP") : "All"}`, 20, 30);

    // Metrics
    if (data) {
      doc.text(`Total Users: ${data.totalUsers}`, 20, 50);
      doc.text(`Premium Users: ${data.premiumUsers}`, 20, 60);
      doc.text(`Total Income: $${data.totalIncome}`, 20, 70);
      doc.text(`Total Rooms: ${data.totalRooms}`, 20, 80);
      doc.text(`Public Rooms: ${data.roomTypes.find(r => r.type === "PUBLIC")?.count || 0}`, 20, 90);
      doc.text(`Private Rooms: ${data.roomTypes.find(r => r.type === "PRIVATE")?.count || 0}`, 20, 100);
    }

    // Capture charts
    const chart1 = document.getElementById("user-chart");
    const chart2 = document.getElementById("income-chart");
    if (chart1 && chart2) {
      const canvas1 = await html2canvas(chart1);
      const canvas2 = await html2canvas(chart2);
      const imgData1 = canvas1.toDataURL("image/png");
      const imgData2 = canvas2.toDataURL("image/png");
      doc.addImage(imgData1, "PNG", 20, 110, 170, 80);
      doc.addImage(imgData2, "PNG", 20, 200, 170, 80);
    }

    doc.save(`dashboard-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success("PDF downloaded");
  };

  const downloadExcel = () => {
    if (!data) return;

    const wb = XLSX.utils.book_new();
    
    // Summary Sheet
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
    XLSX.utils.book_append_sheet(wb, ws1, "Summary");

    // Popular Plans Sheet
    const plansData = [["Plan Name", "Count", "Discount Amount"], ...data.popularPlans.map(p => [p.planName, p.count, p.discountAmount])];
    const ws2 = XLSX.utils.aoa_to_sheet(plansData);
    XLSX.utils.book_append_sheet(wb, ws2, "Popular Plans");

    // Income Over Time Sheet
    const incomeData = [["Year", "Month", "Total"], ...data.incomeOverTime.map(i => [i.year, i.month, i.total])];
    const ws3 = XLSX.utils.aoa_to_sheet(incomeData);
    XLSX.utils.book_append_sheet(wb, ws3, "Income Over Time");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), `dashboard-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Excel downloaded");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!data) return <div className="text-red-500 text-center mt-10">Failed to load data</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Date Range Filter */}
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
              onSelect={setStartDate}
              initialFocus
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
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button onClick={() => { setStartDate(undefined); setEndDate(undefined); }}>
          Clear Dates
        </Button>
      </div>

      {/* Charts */}
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

      {/* Metric Grids */}
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

      {/* Popular Plans Table */}
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

      {/* Download Buttons */}
      <div className="mt-6 flex gap-4">
        <Button onClick={downloadPDF}>Download PDF</Button>
        <Button onClick={downloadExcel}>Download Excel</Button>
      </div>
    </div>
  );
};

export default AdminDashboardd;