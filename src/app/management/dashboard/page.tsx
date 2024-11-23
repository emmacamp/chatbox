"use client";

import { useEffect, useState } from "react";
import { TrendingUp, CalendarIcon } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { addDays, format } from "date-fns";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Client, GetBotAnalyticsResponse } from "@botpress/client";
import { CredentialsClientBP } from "@/types/botpress";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const chartConfig = {
  messages: {
    label: "Messages",
    color: "hsl(var(--chart-1))",
  },
  sessions: {
    label: "Sessions",
    color: "hsl(var(--chart-2))",
  },
  newUsers: {
    label: "New Users",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function DashboardPage({
  credentials,
}: {
  credentials: CredentialsClientBP;
}) {
  const [chartData, setChartData] = useState<
    { date: string; messages: number; sessions: number; newUsers: number }[]
  >([]);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(2024, 10, 12),
    to: addDays(new Date(2024, 10, 12), 20),
  });

  const getBotAnalysis = async () => {
    if (!dateRange.from || !dateRange.to) return;

    const client = new Client({ ...credentials });

    try {
      const response: GetBotAnalyticsResponse = await client.getBotAnalytics({
        id: credentials.botId,
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      });

      const formattedData = response.records.map((record) => ({
        date: new Date(record.startDateTimeUtc).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        messages: Number(record.messages),
        sessions: Number(record.sessions),
        newUsers: Number(record.newUsers),
      }));

      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching bot analysis:", error);
    }
  };

  useEffect(() => {
    getBotAnalysis();
  }, [dateRange]);

  return (
    <Card className="max-w-[600px]">
      <CardHeader className="flex flex-col md:flex-row items-center justify-between">
        <div className=" flex flex-col gap-1">
          <CardTitle>About your bot</CardTitle>
          <CardDescription>Daily performance</CardDescription>
        </div>
        {/* Date Picker */}
        <div className="mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={`w-[300px] justify-start text-left font-normal ${
                  !dateRange.from && "text-muted-foreground"
                }`}
              >
                <CalendarIcon className="mr-2" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) =>
                  setDateRange({ from: range?.from, to: range?.to })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            width={600}
            height={300}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => value}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis />
            <Tooltip
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  formatter={(value: any, name: string) =>
                    `${
                      chartConfig[name as keyof typeof chartConfig]?.label
                    }: ${value}`
                  }
                />
              }
            />
            <Area
              type="monotone"
              dataKey="messages"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
            />
            <Area
              type="monotone"
              dataKey="sessions"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
            />
            <Area
              type="monotone"
              dataKey="newUsers"
              stroke="hsl(var(--chart-3))"
              fill="hsl(var(--chart-3))"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Keep track of your bot&apos;s performance
        </div>
        <div className="leading-none text-muted-foreground">
          Showing bot performance for the selected period
        </div>
      </CardFooter>
    </Card>
  );
}
