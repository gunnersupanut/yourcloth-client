import {
  Database,
  Mail,
  AlertTriangle,
  Code,
  Heart,
  Users,
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl font-kanit">
      {/* --- Page Title --- */}
      <div className="mb-8">
        <h1 className="text-h1xl text-primary mb-2">About Us</h1>
        <p className="text-black text-lg md:text-xl font-medium">
          การพัฒนาระบบบริหารจัดการร้านค้าเสื้อผ้าออนไลน์บนเว็บแอปพลิเคชัน
          <span className="text-primary block md:inline md:ml-2">
            กรณีศึกษาร้านค้าต้นแบบ YourCloth
          </span>
        </p>
      </div>

      {/* --- Section 1: Project Intro & Team --- */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-10">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          {/* Intro Text */}
          <div className="flex-1 space-y-4">
            <h2 className="text-h2xl font-bold text-primary flex items-center gap-2">
              <Heart className="text-secondary fill-secondary" />
              Passion & Purpose
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              เว็บไซต์นี้จัดทำขึ้นในนาม{" "}
              <span className="font-bold text-primary">
                คณะผู้จัดทำโปรเจกต์จบ (Group Project)
              </span>{" "}
              โดยมีวัตถุประสงค์เพื่อศึกษาและพัฒนาระบบ E-Commerce เต็มรูปแบบ
              ตั้งแต่วางโครงสร้าง Database, ออกแบบหน้าเว็บ (Frontend)
              ไปจนถึงจัดการระบบหลังบ้าน (Backend)
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              พวกเรามุ่งมั่นที่จะนำความรู้ที่เรียนมาประยุกต์ใช้เพื่อสร้าง Web
              Application ที่ทันสมัย มีประสิทธิภาพ
              และสามารถต่อยอดใช้งานได้จริงในอนาคต
            </p>
          </div>

          {/* Decorative Divider */}
          <div className="hidden lg:block w-[1px] h-48 bg-gray-200"></div>

          {/* Team Members Area (แก้ชื่อเพื่อนตรงนี้!) */}
          <div className="lg:w-1/3 w-full">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-gray-400" size={20} />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                Development Team
              </p>
            </div>

            <ul className="space-y-4">
              {/* คนที่ 1 */}
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    นายศุภณัฐ องค์เจริญสุข
                  </h3>
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                  K
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    นายกฤตพล พรพงษ์
                  </h3>{" "}
                </div>
              </li>

              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                  R
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">
                    นายรุ่งกวิน พรหมอยู่
                  </h3>{" "}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* --- Section 2 ---*/}
      <div className="mb-12">
        <h2 className="text-h2xl font-bold text-primary mb-6">
          System Highlights
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Database Architecture */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Database size={28} className="text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800">
                  State-Based Table
                </h3>
                <p className="text-gray-600">
                  ออกแบบ Database โดยใช้แนวคิด
                  <span className="font-bold">"Table Per Status"</span> แยกตาราง
                  Order ตามสถานะ (Pending, Paid, Shipped) เพื่อประสิทธิภาพในการ
                  Query และจัดการ Data Flow ที่ซับซ้อน
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono border">
                    PostgreSQL
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-mono border">
                    NeonDB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Tech Stack */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="bg-secondary/20 p-3 rounded-xl">
                <Code size={28} className="text-yellow-700" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-800">
                  Modern Stack
                </h3>
                <p className="text-gray-600">
                  พัฒนาด้วยเครื่องมือยอดนิยมในอุตสาหกรรม เน้น Performance และ
                  Developer Experience ที่ดี
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <TechBadge text="TypeScript" />
                  <TechBadge text="React + Vite" />
                  <TechBadge text="Tailwind CSS" />
                  <TechBadge text="Node.js" />
                  <TechBadge text="Express" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Section 3: Disclaimer & Support --- */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        {/* Disclaimer Card */}
        <div className="flex-1 bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center gap-4">
          <div className="bg-white p-3 rounded-full shadow-sm">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-700">
              Disclaimer (คำเตือน)
            </h3>
            <p className="text-red-600/80 text-sm">
              เว็บไซต์นี้เป็นเพียงโปรเจกต์จำลองเพื่อการศึกษา <br />
              <b>ไม่มีการซื้อขายสินค้าจริง</b> และ <b>ไม่สามารถส่งของได้จริง</b>
            </p>
          </div>
        </div>
      </div>

      {/* --- Section 4: Contact --- */}
      <div className="text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-h2xl font-bold text-primary mb-4">Contact Team</h2>
        <p className="text-gray-500 mb-6">
          หากมีข้อเสนอแนะ หรือต้องการสอบถามข้อมูลเพิ่มเติม
          สามารถติดต่อผ่านตัวแทนกลุ่มได้ที่
        </p>

        <a
          href="mailto:gunnersupanut@gmail.com"
          className="
    inline-flex items-center justify-center gap-2 
    bg-primary text-white 
    w-full md:w-auto 
    px-4 py-3 md:px-8 
    text-sm md:text-base 
    rounded-xl font-bold 
    hover:bg-[#4a3655] transition shadow-custombutton hover:scale-105
  "
        >
          <Mail size={20} className="shrink-0" />
          <span className="truncate">gunnersupanut@gmail.com</span>
        </a>
      </div>
    </div>
  );
};

// Helper Badge
const TechBadge = ({ text }: { text: string }) => (
  <span className="text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
    {text}
  </span>
);

export default AboutPage;
