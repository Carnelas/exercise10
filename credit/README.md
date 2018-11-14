# CREDIT

## 1. Clients
- getCredit 
    busca en la base de datos el crédito
- updateCredit
    crea un nuevo crédito o actualiza el actual

## 2. Controllers
- checkCredit 
    revisa el crédito existente y le hace el decreaseCredit
- creditQueue
    procesa la cola que corresponde al crédito. Revisa si existe crédito suficiente
    y si es así, añade la tarea a la cola. Hace rollback en caso de ser necesario.
- decreaseCredit
    como su nombre indica, disminuye en 1 el crédito
- rollBackCredit
    hace el rollback del credit en caso de que no se realice correctamente la operación
- updateCredit
    actualiza el crédito y da el ok

## 3. Models
- modelo de crédito

## 4. Transactions
- updateCredit
    replica (o no) el coste del crédito en la base de datos