import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './description/description.component';
import { SolutionComponent } from './solution/solution.component';

@Component({
  selector: 'app-content-tabs',
  standalone: true,
  imports: [CommonModule, DescriptionComponent, SolutionComponent],
  template: `
    <div class="content-tabs">
      <div class="tab-header">
        <div class="tab-buttons">
          <button 
            [class.active]="activeTab === 'description'"
            (click)="activeTab = 'description'"
            type="button">
            Description
          </button>
          <button 
            [class.active]="activeTab === 'solution'"
            (click)="activeTab = 'solution'"
            type="button">
            Solution
          </button>
        </div>
        <span *ngIf="isCompleted" class="completion-check">✅</span>
      </div>
      
      <div class="tab-content">
        <app-description 
          *ngIf="activeTab === 'description'"
          [content]="description">
        </app-description>
        <app-solution 
          *ngIf="activeTab === 'solution'"
          [solutionText]="solutionText"
          [solutionCode]="solutionCode">
        </app-solution>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      contain: layout;
      background: var(--surface-card, #ffffff);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .content-tabs {
      height: 100%;
      display: flex;
      flex-direction: column;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
    
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e1e5e9;
      background-color: #f8f9fa;
      flex-shrink: 0;
      width: 100%;
      min-width: 0;
      padding-right: 1rem;
    }
    
    .tab-buttons {
      display: flex;
      
      button {
        background: none;
        border: none;
        padding: 12px 24px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: #6c757d;
        border-bottom: 3px solid transparent;
        transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
        white-space: nowrap;
        
        &:hover {
          color: #495057;
          background-color: #e9ecef;
        }
        
        &.active {
          color: #007bff;
          border-bottom-color: #007bff;
          background-color: white;
        }
      }
    }
    
    .completion-check {
      font-size: 1.2rem;
      margin-left: 0.5rem;
    }
    
    .tab-content {
      flex: 1;
      overflow: hidden;
      background-color: white;
      width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
    
    // Dark mode overrides
    :host-context(.dark-mode) .tab-header {
      background-color: var(--surface-200, #2d2d2d) !important;
      border-bottom-color: var(--surface-border, #555) !important;
    }
    
    :host-context(.dark-mode) .tab-header button {
      color: var(--text-color-secondary, #cccccc) !important;
    }
    
    :host-context(.dark-mode) .tab-header button:hover {
      color: var(--text-color, #ffffff) !important;
      background-color: var(--surface-300, #444) !important;
    }
    
    :host-context(.dark-mode) .tab-header button.active {
      color: var(--primary-300, #66ccff) !important;
      border-bottom-color: var(--primary-300, #66ccff) !important;
      background-color: var(--surface-card, #1f1f1f) !important;
    }
    
    :host-context(.dark-mode) .tab-content {
      background-color: var(--surface-card, #1f1f1f) !important;
    }
    
    :host-context(.dark-mode) {
      background: var(--surface-card, #1f1f1f) !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
    }
    
    @media (prefers-color-scheme: dark) {
      .tab-header {
        background-color: var(--surface-200, #2d2d2d) !important;
        border-bottom-color: var(--surface-border, #555) !important;
      }
      
      .tab-header button {
        color: var(--text-color-secondary, #cccccc) !important;
      }
      
      .tab-header button:hover {
        color: var(--text-color, #ffffff) !important;
        background-color: var(--surface-300, #444) !important;
      }
      
      .tab-header button.active {
        color: var(--primary-300, #66ccff) !important;
        border-bottom-color: var(--primary-300, #66ccff) !important;
        background-color: var(--surface-card, #1f1f1f) !important;
      }
      
      .tab-content {
        background-color: var(--surface-card, #1f1f1f) !important;
      }
      
      :host {
        background: var(--surface-card, #1f1f1f) !important;
        border-color: rgba(255, 255, 255, 0.1) !important;
      }
    }
  `]
})
export class ContentTabsComponent {
  @Input() description: string = '';
  @Input() solutionText: string = '';
  @Input() solutionCode: string = '';
  @Input() isCompleted: boolean = false;
  
  activeTab: 'description' | 'solution' = 'description';
}