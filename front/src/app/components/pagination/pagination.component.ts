
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { globalModules } from '../../globalModules';

@Component({
  selector: 'app-pagination',
  imports: [...globalModules,
  ],  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() totalPages: number = 0;
  @Input() currentPage: number = 1;

  @Output() pageChanged = new EventEmitter<number>();

  /**
   * Navegar para a próxima página, se disponível.
   */
  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.changePage(this.currentPage + 1);
    }
  }

  /**
   * Navegar para a página anterior, se disponível.
   */
  goToPrevPage(): void {
    if (this.currentPage > 1) {
      this.changePage(this.currentPage - 1);
    }
  }

  /**
   * Navegar para uma página específica.
   * @param page Número da página desejada.
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.changePage(page);
    }
  }

  /**
   * Emite o evento de mudança de página.
   * @param page Número da nova página.
   */
  private changePage(page: number): void {
    this.currentPage = page;
    this.pageChanged.emit(this.currentPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Faz o scroll suave
    });
  }

  /**
   * Retorna o intervalo de números de página para exibição.
   * @returns Array de números de página.
   */
  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }
}
