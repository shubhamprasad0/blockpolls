import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PollsTable = ({ polls }: { polls: PollData[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">
            Participant Count
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {polls.map((p, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{p.question}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {p.isActive ? "Active" : "Completed"}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {p.numParticipants.toString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PollsTable;
