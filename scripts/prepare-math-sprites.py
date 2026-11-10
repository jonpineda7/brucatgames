import struct,zlib,json,sys
from pathlib import Path
src=Path(sys.argv[1]); destination=Path(sys.argv[2]); destination.mkdir(parents=True,exist_ok=True)
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
w,h,rows=read(src);out=[bytearray(w*4) for _ in range(h)];meta=[]
for i in range(12):
 ox=(i%4)*362;oy=(i//4)*362
 # Only retain the character's largest connected alpha component; disconnected AI dust is discarded.
 remaining={y*362+x for y in range(362) for x in range(362) if rows[oy+y][(ox+x)*4+3]>=48};groups=[]
 while remaining:
  seed=remaining.pop();comp={seed};stack=[seed]
  while stack:
   k=stack.pop();x=k%362;y=k//362
   for nx,ny in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
    n=ny*362+nx
    if 0<=nx<362 and 0<=ny<362 and n in remaining:remaining.remove(n);comp.add(n);stack.append(n)
  groups.append(comp)
 comp=max(groups,key=len);xs=[k%362 for k in comp];ys=[k//362 for k in comp];box=[min(xs),min(ys),max(xs)+1,max(ys)+1]
 # Keep antialiased edge pixels within a two-pixel dilation of the connected silhouette.
 keep=set()
 for k in comp:
  x=k%362;y=k//362
  for dy in range(-2,3):
   for dx in range(-2,3):
    if 0<=x+dx<362 and 0<=y+dy<362:keep.add((y+dy)*362+x+dx)
 # Normalize horizontal body center and baseline. Vertical jump in frame 5 is intentional.
 dx=-12;dy=round(350-box[3]) if i!=5 else 0
 for k in keep:
  x=k%362;y=k//362;tx=x+dx;ty=y+dy
  if 0<=tx<362 and 0<=ty<362:out[oy+ty][(ox+tx)*4:(ox+tx)*4+4]=rows[oy+y][(ox+x)*4:(ox+x)*4+4]
 meta.append({'index':i,'sourceBounds':box,'offset':[dx,dy],'discardedComponents':len(groups)-1})
 print(meta[-1])
write(destination/'brucat-math-sprites.png',w,h,out)
(destination/'frames.json').write_text(json.dumps(meta,indent=2))
