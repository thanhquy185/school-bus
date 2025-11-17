import type { StudentResponse } from "../../responses/student.response";

interface StudentListProps {
  students: StudentResponse[];
  selectedStudent: StudentResponse | null;
  onSelectStudent: (student: StudentResponse) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const StudentList = ({
  students,
  selectedStudent,
  onSelectStudent,
  currentPage,
  totalPages,
  onPageChange,
}: StudentListProps) => {
  return (
    <div className="w-[calc(30%-10px)] p-2.5 border border-[#eee] rounded-md">
      <div className="space-y-0">
        {students.map((student) => {
          const isSelected = selectedStudent?.id === student.id;
          return (
            <div
              key={student.id}
              onClick={() => onSelectStudent(student)}
              className={`flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-colors ${
                isSelected ? "bg-[#FFE08A]" : "hover:bg-[#f5f5f5]"
              }`}
            >
              {/* Avatar */}
              <img
                src={student.avatar || "https://i.pravatar.cc/100"}
                alt={student.full_name}
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-[16px] truncate transition-colors ${
                    isSelected ? "text-[#003366]" : "text-[rgba(0,0,0,0.88)]"
                  }`}
                >
                  {student.full_name}
                </p>
                <p className="text-[14px] text-[rgba(0,0,0,0.65)] truncate">
                  Lớp: {student.class?.name || "N/A"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination - chỉ hiện khi có nhiều hơn 1 trang */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 px-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              currentPage === 1
                ? "bg-[#f5f5f5] text-[rgba(0,0,0,0.25)] cursor-not-allowed"
                : "bg-[#1677ff] text-white hover:bg-[#4096ff]"
            }`}
          >
            Trước
          </button>
          <span className="text-sm text-[rgba(0,0,0,0.65)]">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              currentPage === totalPages
                ? "bg-[#f5f5f5] text-[rgba(0,0,0,0.25)] cursor-not-allowed"
                : "bg-[#1677ff] text-white hover:bg-[#4096ff]"
            }`}
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentList;
