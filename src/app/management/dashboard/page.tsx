import { Card, CardContent, CardHeader, CardTitle } from "@/components";

export default function Page() {
  return (
    <div className="flex flex-1 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Reccurring Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Monthly Reccurring Revenue</p>
          <p>$10,000.00</p>
          <p>100% of total revenue</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Reccurring Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Monthly Reccurring Revenue</p>
          <p>$10,000.00</p>
          <p>100% of total revenue</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Monthly Reccurring Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Monthly Reccurring Revenue</p>
          <p>$10,000.00</p>
          <p>100% of total revenue</p>
        </CardContent>
      </Card>
    </div>
  );
}
