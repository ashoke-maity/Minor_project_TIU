import React, { useState, useMemo } from 'react';
import { ColumnDirective, ColumnsDirective, GridComponent, Inject, Page } from "@syncfusion/ej2-react-grids";
import { cn, formatDate } from '../lib/utils';
import { useSearchParams, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AllDonations = () => {
  const [donations] = useState([
    {
      id: 1,
      donorName: 'Jordan',
      email: 'jordan@example.com',
      date: '2024-12-01',
      amount: 100.0,
      type: 'One-Time',
      status: 'Completed',
      imageUrl: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      donorName: 'Maya',
      email: 'maya@example.com',
      date: '2024-11-12',
      amount: 50.0,
      type: 'Recurring',
      status: 'Pending',
      imageUrl: 'https://i.pravatar.cc/150?img=2'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialPage = Number(searchParams.get('page') || '1');
  const [currentPage, setCurrentPage] = useState(initialPage);
  const pageSize = 10;

  const filteredDonations = useMemo(() => {
    return donations.filter(d =>
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, donations]);

  const handlePageChange = (args) => {
    const page = args.currentPage;
    setCurrentPage(page);
    navigate(`?page=${page}`);
  };

  const downloadCSV = () => {
    const csvRows = [
      ['Donor Name', 'Email', 'Date', 'Amount', 'Type', 'Status'],
      ...filteredDonations.map(d =>
        [d.donorName, d.email, d.date, `$${d.amount.toFixed(2)}`, d.type, d.status]
      )
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'donations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Donation Report', 14, 16);
    doc.autoTable({
      startY: 22,
      head: [['Donor Name', 'Email', 'Date', 'Amount', 'Type', 'Status']],
      body: filteredDonations.map(d =>
        [d.donorName, d.email, formatDate(d.date), `$${d.amount.toFixed(2)}`, d.type, d.status]
      ),
    });
    doc.save('donations.pdf');
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      {/* Header section */}
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full max-w-sm">
          <img
            src="/icons/search.svg"
            alt="Search Icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search name transaction or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Download Buttons */}
        <div className="flex gap-2">
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-green-600 text-white hover:bg-green-600/80 transition"
          >
            <img src="/icons/csv.svg" alt="CSV Icon" className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            <img src="/icons/pdf-file.svg" alt="PDF Icon" className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>

      {/* Donation Table */}
      <GridComponent
        dataSource={filteredDonations}
        gridLines="None"
        allowPaging={true}
        pageSettings={{ pageSize, currentPage }}
        actionComplete={handlePageChange}
      >
        <ColumnsDirective>
          <ColumnDirective
            field="donorName"
            headerText="Donor"
            width="200"
            textAlign="Left"
            template={(data) => (
              <div className="flex items-center gap-1.5 px-4">
                <img
                  src={data.imageUrl}
                  alt="donor"
                  className="rounded-full size-8 aspect-square"
                  referrerPolicy="no-referrer"
                />
                <span>{data.donorName}</span>
              </div>
            )}
          />
          <ColumnDirective
            field="email"
            headerText="Email"
            width="200"
            textAlign="Left"
          />
          <ColumnDirective
            field="date"
            headerText="Date"
            width="130"
            textAlign="Left"
            template={(data) => formatDate(data.date)}
          />
          <ColumnDirective
            field="amount"
            headerText="Amount ($)"
            width="120"
            textAlign="Right"
            template={(data) => (
              <div className="text-right font-medium text-gray-700">${data.amount.toFixed(2)}</div>
            )}
          />
          <ColumnDirective
            field="type"
            headerText="Type"
            width="130"
            textAlign="Left"
            template={(data) => (
              <span className="text-xs font-medium px-2 py-1 rounded bg-blue-50 text-blue-700">
                {data.type}
              </span>
            )}
          />
          <ColumnDirective
            field="status"
            headerText="Status"
            width="120"
            textAlign="Left"
            template={(data) => {
              const badgeStyle = {
                Completed: 'bg-green-100 text-green-700',
                Pending: 'bg-yellow-100 text-yellow-700',
                Failed: 'bg-red-100 text-red-700'
              }[data.status] || 'bg-gray-100 text-gray-600';

              return (
                <span className={`text-xs font-medium px-2 py-1 rounded ${badgeStyle}`}>
                  {data.status}
                </span>
              );
            }}
          />
        </ColumnsDirective>
        <Inject services={[Page]} />
      </GridComponent>
    </div>
  );
};

export default AllDonations;
