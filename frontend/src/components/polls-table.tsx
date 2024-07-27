import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoPolls from "./no-polls";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const PollsTable = ({ polls }: { polls: PollData[] }) => {
  const router = useRouter();

  if (polls.length === 0) {
    return <NoPolls />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Question</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="hidden md:table-cell">
            Participant Count
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {polls.map((p, i) => (
          <TableRow
            className="hover:cursor-pointer"
            key={i}
            onClick={() => {
              router.push(`/polls/${p.id}`);
            }}
          >
            <TableCell className="font-medium">{p.question}</TableCell>
            <TableCell className="text-center">
              <Badge
                className={cn(
                  "uppercase tracking-widest font-black",
                  p.isActive && "bg-success text-background",
                  !p.isActive && "bg-destructive"
                )}
                variant="outline"
              >
                {p.isActive ? "Active" : "Closed"}
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
