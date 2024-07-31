import Navbar from '../components/navbar/Navbar';
import SuperTable from '../components/practice/PracticeTable';

const PracticeTablePage = () => {
  return (
    <div>
      <Navbar />
      <SuperTable data={data} columns={columns} />
    </div>
  );
};

export default PracticeTablePage;

const data = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com' },
  // ... more data
];

const columns = [
  { header: 'ID', accessor: 'id', sortable: true },
  { header: 'Name', accessor: 'name', sortable: true },
  { header: 'Age', accessor: 'age', sortable: true },
  { header: 'Email', accessor: 'email', sortable: true },
];
