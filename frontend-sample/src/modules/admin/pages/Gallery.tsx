import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Search, Image as ImageIcon } from 'lucide-react';

export default function Gallery() {
  const [searchTerm, setSearchTerm] = useState('');

  const albums = [
    { id: '1', title: 'Annual Day 2026', photos: 45, date: '2026-02-10', thumbnail: '/placeholder.jpg' },
    { id: '2', title: 'Sports Day', photos: 32, date: '2026-01-25', thumbnail: '/placeholder.jpg' },
    { id: '3', title: 'Science Fair', photos: 28, date: '2026-01-15', thumbnail: '/placeholder.jpg' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Gallery Management</h1>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Photos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {albums.map((album) => (
              <Card key={album.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">{album.title}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{album.photos} photos</span>
                    <span>{album.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
