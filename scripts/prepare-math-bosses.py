import struct,zlib,json,sys
from pathlib import Path

def read(p):
 b=p.read_bytes();pos=8;data=b''
 while pos<len(b):
  n=struct.unpack('>I',b[pos:pos+4])[0];t=b[pos+4:pos+8];c=b[pos+8:pos+8+n];pos+=n+12
  if t==b'IHDR':w,h,d,col,*_=struct.unpack('>IIBBBBB',c);assert d==8 and col==6
  if t==b'IDAT':data+=c
 raw=zlib.decompress(data);rows=[];prev=bytearray(w*4)
 for y in range(h):
  f=raw[y*(w*4+1)];row=bytearray(raw[y*(w*4+1)+1:(y+1)*(w*4+1)])
  for x in range(w*4):
   a=row[x-4] if x>=4 else 0;b=prev[x];c=prev[x-4] if x>=4 else 0
   if f==1:v=a
   elif f==2:v=b
   elif f==3:v=(a+b)//2
   elif f==4:
    p=a+b-c;ds=[abs(p-a),abs(p-b),abs(p-c)];v=[a,b,c][ds.index(min(ds))]
   else:v=0
   row[x]=(row[x]+v)%256
  rows.append(row);prev=row
 return w,h,rows
def write(p,w,h,rows):
 def chunk(t,b):return struct.pack('>I',len(b))+t+b+struct.pack('>I',zlib.crc32(t+b))
 p.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(b'\0'+bytes(r) for r in rows),9))+chunk(b'IEND',b''))

import shutil
source=Path('/Users/jonathanpineda/Documents/ChatGPT/WebMaster/output/imagegen')
destination=Path('public/games/math-adventure/bosses');destination.mkdir(parents=True,exist_ok=True)
metadata=[]
for sheet in range(2):
 name=['brucat-bosses-01-05.png','brucat-bosses-06-10.png'][sheet]
 shutil.copy2(source/name,destination/name)
 w,h,rows=read(source/name)
 # Segment the entire sheet first: poses cross nominal column boundaries.
 pixels={(x,y) for y in range(h) for x in range(w) if rows[y][x*4+3]>=40}
 groups=[]
 while pixels:
  seed=pixels.pop();component={seed};stack=[seed]
  while stack:
   x,y=stack.pop()
   for q in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
    if q in pixels:pixels.remove(q);component.add(q);stack.append(q)
  groups.append(component)
 groups.sort(key=len,reverse=True)
 bodies=groups[:15]
 assert min(map(len,bodies))>10000
 bodies.sort(key=lambda g:sum(y for x,y in g)/len(g))
 ordered=[]
 for row in range(3):ordered.extend(sorted(bodies[row*5:row*5+5],key=lambda g:sum(x for x,y in g)/len(g)))
 for i,body in enumerate(ordered):
  row,col=divmod(i,5);state=['idle','impact','friendly'][row]
  left=min(x for x,y in body);right=max(x for x,y in body)+1;top=min(y for x,y in body);bottom=max(y for x,y in body)+1
  keep=set(body)
  for accessory in groups[15:]:
   if len(accessory)>=80 and all(left-12<=x<right+12 and top-12<=y<bottom+12 for x,y in accessory):keep.update(accessory)
  left=min(x for x,y in keep);right=max(x for x,y in keep)+1;top=min(y for x,y in keep);bottom=max(y for x,y in keep)+1
  out=[bytearray(352*4) for _ in range(352)]
  dx=round((352-(right-left))/2)-left;dy=336-bottom
  dilated={(x+a,y+b) for x,y in keep for a,b in [(0,0),(1,0),(-1,0),(0,1),(0,-1)]}
  for x,y in dilated:
   if 0<=x<w and 0<=y<h and 0<=x+dx<352 and 0<=y+dy<352:out[y+dy][(x+dx)*4:(x+dx)*4+4]=rows[y][x*4:x*4+4]
  filename=f'{sheet*5+col+1:02}-{state}.png';write(destination/filename,352,352,out)
  metadata.append({'file':filename,'source':name,'crop':[left,top,right,bottom],'offset':[dx,dy],'baseline':336,'canvas':[352,352]})
(destination/'frames.json').write_text(json.dumps(metadata,indent=2))
