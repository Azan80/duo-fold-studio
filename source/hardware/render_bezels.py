import bpy, math, os, sys
from mathutils import Vector

OUT=os.path.abspath(os.path.join(os.path.dirname(__file__),'../../dist/assets/hardware'))
os.makedirs(OUT,exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def material(name, color, metallic, roughness, brushed=False):
    mat=bpy.data.materials.new(name); mat.use_nodes=True
    nodes=mat.node_tree.nodes; bs=nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Metallic'].default_value=metallic
    bs.inputs['Roughness'].default_value=roughness
    if brushed:
        anisotropy=bs.inputs.get('Anisotropic IOR Level') or bs.inputs.get('Anisotropic')
        if anisotropy:anisotropy.default_value=.32
        noise=nodes.new('ShaderNodeTexNoise'); noise.inputs['Scale'].default_value=1050
        noise.inputs['Detail'].default_value=1.5
        bump=nodes.new('ShaderNodeBump'); bump.inputs['Strength'].default_value=.095
        bump.inputs['Distance'].default_value=.000055
        mat.node_tree.links.new(noise.outputs['Fac'],bump.inputs['Height'])
        mat.node_tree.links.new(bump.outputs['Normal'],bs.inputs['Normal'])
    return mat

silver=material('Silver • satin titanium',(.56,.57,.58),.92,.30,True)
silver_edge=material('Silver • polished chamfer',(.73,.75,.78),1,.16)
dark=material('Graphite • satin titanium',(.085,.095,.105),.93,.31,True)
dark_edge=material('Graphite • diamond cut chamfer',(.22,.24,.26),1,.18)
glass=material('Black • glass perimeter',(.007,.009,.013),.22,.20)
gasket=material('Black • precision glass gasket',(.004,.005,.007),.05,.41)

# U-shaped cross-section: the screen intentionally opens at the hinge edge.
# CSS leaf box 310 x 416; screen aperture x=9..310, y=9..407.
def path(t):
    r=26-t
    # Three-pixel hinge corners match the leaf's small inner-side outer radius.
    hinge_x=307+math.sqrt(max(0,9-(3-t)**2)) if t<3 else 310
    points=[(hinge_x,t),(26,t)]
    for i in range(1,33):
        a=-math.pi/2-i*math.pi/64
        points.append((26+r*math.cos(a),26+r*math.sin(a)))
    points.append((t,390))
    for i in range(1,33):
        a=math.pi-i*math.pi/64
        points.append((26+r*math.cos(a),390+r*math.sin(a)))
    points.append((hinge_x,416-t))
    return points

def cover_path(t):
    r=26-t
    points=[(284,t),(26,t)]
    for i in range(1,33):
        a=-math.pi/2-i*math.pi/64
        points.append((26+r*math.cos(a),26+r*math.sin(a)))
    points.append((t,390))
    for i in range(1,33):
        a=math.pi-i*math.pi/64
        points.append((26+r*math.cos(a),390+r*math.sin(a)))
    points.append((284,416-t))
    for i in range(1,33):
        a=math.pi/2-i*math.pi/64
        points.append((284+r*math.cos(a),390+r*math.sin(a)))
    points.append((310-t,26))
    for i in range(1,32):
        a=-i*math.pi/64
        points.append((284+r*math.cos(a),26+r*math.sin(a)))
    return points

# Every metal highlight comes from explicit machined faces and softbox lighting.
profile=[(0,-1.3),(.12,-.05),(.46,.43),(1.08,.75),
         (1.45,.81),(2.05,.81),(2.5,.81),(2.85,.81),(3.0,.81),
         (4.35,.81),(4.88,.68),(5.22,.25),
         (5.40,.18),(5.74,.27),(8.45,.27),(9,-.25),(9,-1.3)]
# Corresponding materials between pairs of rings: body, edge, body, inset glass.
face_mats=[0,1,1,0,0,0,0,0,0,1,1,3,3,2,2,3]

def make_leaf(mirror=False,closed=False):
    contour=cover_path if closed else path
    verts=[]
    for t,z in profile:
        for x,y in contour(t):
            if mirror:x=310-x
            verts.append(((x-155)/100,(208-y)/100,z/100))
    n=len(contour(0)); faces=[]; mi=[]
    for k in range(len(profile)-1):
        for i in range(n if closed else n-1):
            j=(i+1)%n
            f=(k*n+i,k*n+j,(k+1)*n+j,(k+1)*n+i)
            faces.append(f if not mirror else f[::-1]); mi.append(face_mats[k])
    # End caps and rear plate keep the mesh physically closed.
    for i in ([] if closed else [0,n-1]):
        f=tuple(k*n+i for k in range(len(profile)))
        faces.append(f if i==0 else f[::-1]);mi.append(0)
    for i in range(n if closed else n-1):
        j=(i+1)%n
        faces.append((i,(len(profile)-1)*n+i,(len(profile)-1)*n+j,j));mi.append(0)
    mesh=bpy.data.meshes.new('Enclosed cover frame mesh' if closed else 'Precision U frame mesh');mesh.from_pydata(verts,[],faces);mesh.update()
    ob=bpy.data.objects.new('Cover' if closed else ('Right leaf' if mirror else 'Left leaf'),mesh);bpy.context.collection.objects.link(ob)
    for mat in [silver,silver_edge,glass,gasket]:ob.data.materials.append(mat)
    for p,m in zip(mesh.polygons,mi):p.material_index=m;p.use_smooth=False
    return ob

left=make_leaf(False);right=make_leaf(True);right.hide_render=True
cover=make_leaf(closed=True);cover.hide_render=True

def area(name,loc,power,size,scale=(1,1,1),color=(1,1,1)):
    data=bpy.data.lights.new(name,'AREA'); data.energy=power;data.shape='RECTANGLE';data.size=size;data.size_y=size*scale[1]
    data.color=color;ob=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(ob);ob.location=loc
    ob.rotation_euler=(Vector((0,0,0))-ob.location).to_track_quat('-Z','Y').to_euler()
area('Large overhead softbox',(-1.5,2.8,4),290,4,(1,.75,1),(1,.96,.92))
area('Long left edge strip',(-3.5,.25,1.4),170,3,(1,.18,1),(.86,.92,1))
area('Low grazing right strip',(3,-1.5,2.7),150,3,(1,.25,1),(1,1,1))
area('Frontal fill',(0,.5,5),90,4,(1,.9,1),(1,1,1))

camera_data=bpy.data.cameras.new('Orthographic front • exact CSS bounds')
camera=bpy.data.objects.new('Orthographic front • exact CSS bounds',camera_data);bpy.context.collection.objects.link(camera)
camera.location=(0,0,8);camera.rotation_euler=(0,0,0);camera.data.type='ORTHO';camera.data.ortho_scale=4.16
scene=bpy.context.scene;scene.camera=camera
scene.render.engine='CYCLES';scene.cycles.samples=48;scene.cycles.use_denoising=True
scene.render.resolution_x=930;scene.render.resolution_y=1248;scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.world.color=(.22,.22,.22)
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.image_settings.color_depth='8';scene.render.image_settings.compression=65
scene.view_settings.view_transform='AgX'
scene.view_settings.look='AgX - Medium High Contrast'
scene.view_settings.exposure=.55
scene.render.image_settings.color_mode='RGBA'

for tone,body,edge in [('silver',silver,silver_edge),('dark',dark,dark_edge)]:
    for side,ob in [('left',left),('right',right),('cover',cover)]:
        if '--cover-only' in sys.argv and side!='cover':continue
        left.hide_render=ob!=left;right.hide_render=ob!=right;cover.hide_render=ob!=cover
        ob.data.materials[0]=body;ob.data.materials[1]=edge
        scene.render.filepath=os.path.join(OUT,f'bezel-{tone}-{side}.png')
        bpy.ops.render.render(write_still=True)

left.hide_render=False;right.hide_render=True;cover.hide_render=True
left.data.materials[0]=silver;left.data.materials[1]=silver_edge
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(os.path.dirname(__file__),'duo-hardware.blend'))
print('FINISHED: six 930×1248 RGBA PNGs and duo-hardware.blend')
