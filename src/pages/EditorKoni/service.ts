import request from '@/utils/request';

export function getProtein(params:any){
    return request('/api/sparql',{
        method:"GET",
        data:params
        
    });
  }