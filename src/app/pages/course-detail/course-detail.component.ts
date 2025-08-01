import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../../services/local-storage.service';

interface CourseQuestion {
  filename: string;
  title: string;
}

interface CourseSection {
  title: string;
  description?: string;
  questions: CourseQuestion[];
}

interface Course {
  course_name: string;
  course_description: string;
  [key: string]: any;
}

@Component({
  selector: 'app-course-detail',
  imports: [CommonModule],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.scss'
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  courseSections: CourseSection[] = [];
  courseName = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.courseName = params['filename'];
      this.loadCourse();
    });
  }

  private loadCourse() {
    this.http.get<Course>(`/courses/${this.courseName}.json`).subscribe({
      next: (data) => {
        this.course = data;
        this.extractSections();
      },
      error: (error) => {
        console.error('Failed to load course:', error);
        this.router.navigate(['/courses']);
      }
    });
  }

  private extractSections() {
    if (!this.course) return;
    
    const sections: CourseSection[] = [];
    
    // Iterate through all course properties to find sections
    for (const [key, value] of Object.entries(this.course)) {
      if (key !== 'course_name' && key !== 'course_description' && key !== 'duration' && key !== 'difficulty') {
        if (typeof value === 'object' && value !== null) {
          // This is likely a container for sections (like 'weeks', 'days', 'modules')
          this.extractSectionsFromContainer(value, sections);
        }
      }
    }
    
    this.courseSections = sections;
  }

  private extractSectionsFromContainer(container: any, sections: CourseSection[]) {
    for (const [key, value] of Object.entries(container)) {
      if (typeof value === 'object' && value !== null) {
        const section: CourseSection = {
          title: (value as any).title || this.formatSectionTitle(key),
          description: (value as any).description,
          questions: []
        };
        
        // Extract questions from this section
        if ((value as any).questions && Array.isArray((value as any).questions)) {
          for (const questionFilename of (value as any).questions) {
            if (typeof questionFilename === 'string') {
              section.questions.push({
                filename: questionFilename,
                title: this.formatQuestionTitle(questionFilename)
              });
            }
          }
        }
        
        sections.push(section);
      }
    }
  }

  private formatSectionTitle(key: string): string {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private formatQuestionTitle(filename: string): string {
    return filename
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  onQuestionClick(question: CourseQuestion) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/questions', question.filename])
    );
    window.open(url, '_blank');
  }

  goBack() {
    this.router.navigate(['/courses']);
  }

  toggleFavorite() {
    this.localStorageService.toggleFavoriteCourse(this.courseName);
  }

  isFavorite(): boolean {
    return this.localStorageService.isCourseInFavorites(this.courseName);
  }

  isQuestionCompleted(questionFilename: string): boolean {
    return this.localStorageService.isQuestionCompleted(questionFilename);
  }
}