// takes in job postings in the structure defined in
// types/responseObject.d.ts and displays them in a table




import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table.tsx"



export function DisplayTitles({ titles }: { titles: string[] }) {
    return (
        <Table>
            <TableCaption>A list of job postings.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[100px]">Title</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {titles.map((title) => (
                    <TableRow >
                        <TableCell className="font-medium">{title}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
            {/* <TableFooter>
                <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">$2,500.00</TableCell>
                </TableRow>
            </TableFooter> */}
        </Table>
    )
}
