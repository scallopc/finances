import { InMemoryDbService } from "angular-in-memory-web-api";
import { Category } from "src/app/pages/categories/shared/category.model";
export class InMemoryDatabase implements InMemoryDbService{
     
    createDb(){

       const categories: Category[] = [
            {id: 1, name:'Moradia', description: 'Pagamentos de Contas da casa'},
            {id: 2, name:'Saúde', description: 'Plano de saúde e remádios'},
            {id: 3, name:'Lazer', description: 'Cinema, parques, praia, etc'},
            {id: 4, name:'Salário', description: 'Recebimento de salário'},
            {id: 5, name:'Freelas', description: 'Trabalhos como freelancer'}     
        ];

        return { categories }
     }   

   
}
