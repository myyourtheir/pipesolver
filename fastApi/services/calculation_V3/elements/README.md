Каждый новый элемент должен реализовывать интерфейс AbstractElement.  
При этом необходимо переопределить методы make_initial_distribution и unsteady_solve.  
В методе make_initial_destribution необходимо определить родительский и дочерние элементы, и их диаметры соответсвенно и присвоить эти значения в инстанс класса.  
Это необходимо для метода unstedy_solve.  
