import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, Download, Search, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

const materials = [
  { id: '1', title: 'Chapter 5 - Algebra Notes', subject: 'Mathematics', class: '10-A', type: 'PDF', size: '2.4 MB', date: '2026-02-15', downloads: 45 },
  { id: '2', title: 'Physics Lab Manual', subject: 'Physics', class: '10-A', type: 'PDF', size: '5.1 MB', date: '2026-02-14', downloads: 38 },
  { id: '3', title: 'English Grammar Worksheet', subject: 'English', class: '9-A', type: 'DOCX', size: '1.2 MB', date: '2026-02-13', downloads: 52 },
  { id: '4', title: 'Chemistry Periodic Table', subject: 'Chemistry', class: '10-B', type: 'PDF', size: '800 KB', date: '2026-02-12', downloads: 41 },
  { id: '5', title: 'History Timeline Chart', subject: 'History', class: '9-B', type: 'PDF', size: '1.8 MB', date: '2026-02-11', downloads: 29 },
];

export default function Materials() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Study Materials</h1>
          <p className="text-lg text-muted-foreground mt-2">Upload and manage learning resources</p>
        </div>
        <Button className="h-11 text-base">
          <Upload className="mr-2 h-5 w-5" />
          Upload Material
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Total Materials</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">127</div>
            <p className="text-sm text-muted-foreground mt-1">Across all subjects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">This Month</CardTitle>
            <Upload className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18</div>
            <p className="text-sm text-muted-foreground mt-1">New uploads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Total Downloads</CardTitle>
            <Download className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,456</div>
            <p className="text-sm text-muted-foreground mt-1">By students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base font-medium">Storage Used</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2.8 GB</div>
            <p className="text-sm text-muted-foreground mt-1">Of 10 GB</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 text-base"
              />
            </div>
            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="w-[200px] h-11 text-base">
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="history">History</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{material.title}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                      <span>{material.subject}</span>
                      <span>•</span>
                      <span>Class {material.class}</span>
                      <span>•</span>
                      <span>{material.size}</span>
                      <span>•</span>
                      <span>{material.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
